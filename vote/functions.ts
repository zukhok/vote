import {createClient} from "redis";

export default {
  async getCandidates() {
    let redis = await createClient().connect();
    let candidatesJSON = JSON.parse(await redis.get("candidates") as string);
    console.log({candidatesJSON});
    if(!candidatesJSON) {
      candidatesJSON = {};
      let q = new Parse.Query("Candidates");
      q.select("name");
      for(let candidate of await q.findAll({useMasterKey: true})) candidatesJSON[candidate.id] = candidate.get("name");
      await redis.set("candidates", JSON.stringify(candidatesJSON));
    }
    await redis.disconnect();
    return candidatesJSON;
  },

  async vote(userId: string, ids: string[]) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId, {useMasterKey: true});
    if(u.get("isAdmin")) throw -1;
    if(ids.length < 2) throw -2;
    q = new Parse.Query("Votes");
    q.equalTo("userId", userId);
    if(await q.count({useMasterKey: true})) throw -3;
    if(!(await Parse.Config.get({useMasterKey: true})).get("opening")) throw -4;

    q = new Parse.Query("Candidates");
    q.containedIn("objectId", ids);
    let candidates = await q.findAll({useMasterKey: true});
    let votes: Parse.Object[] = [];
    for(let id of ids) {
      let candidate = candidates.find(candidate => candidate.id == id);
      if(candidate) {
        let vote = new Parse.Object("Votes");
        vote.set("userId", userId);
        vote.set("candidateId", candidate.id);
        vote.set("name", candidate.get("name"));
        votes.push(vote);
      }
    }
    if(votes.length) await Parse.Object.saveAll(votes);
    for(let candidate of candidates) candidate.increment("votes");
    return await Parse.Object.saveAll(candidates);
  },

  async getMyVotes(userId: string) {
    let q = new Parse.Query("Votes");
    q.equalTo("userId", userId);
    let votes = await q.findAll({useMasterKey: true});

    q = new Parse.Query("Candidates");
    q.containedIn("objectId", votes.map(vote => vote.get("candidateId")));
    q.limit(await q.count({useMasterKey: true}));
    q.descending("votes");
    return await q.find({useMasterKey: true});
  },

  async addCandidates(userId: string, names: string[]) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId, {useMasterKey: true});
    if(!u.get("isAdmin")) throw -1;

    if((await Parse.Config.get({useMasterKey: true})).get("opening")) throw -2;

    let candidates: Parse.Object[] = [];
    for(let name of names) {
      let c = new Parse.Object("Candidates");
      c.set("name", name);
      candidates.push(c);
    }
    return await Parse.Object.saveAll(candidates, {useMasterKey: true});
  },

  async updateCandidates(userId: string, candidates: {[id: string]: string;}) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId, {useMasterKey: true});
    if(!u.get("isAdmin")) throw -1;
    if((await Parse.Config.get({useMasterKey: true})).get("opening")) throw -2;

    q = new Parse.Query("Candidates");
    q.containedIn("objectId", Object.keys(candidates));
    let candidates2Update = await q.findAll({useMasterKey: true});
    for(let candidate of candidates2Update) candidate.set("name", candidates[candidate.id]);
    return await Parse.Object.saveAll(candidates2Update, {useMasterKey: true});
  },

  async deleteCandidates(userId: string, ids: string[]) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId);
    if(!u.get("isAdmin")) throw -1;
    if((await Parse.Config.get({useMasterKey: true})).get("opening")) throw -2;

    q = new Parse.Query("Candidates");
    q.containedIn("objectId", ids);
    return await Parse.Object.destroyAll(await q.findAll({useMasterKey: true}), {useMasterKey: true});
  },

  async adminGetCandidates(userId: string) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId, {useMasterKey: true});
    if(!u.get("isAdmin")) throw -1;

    q = new Parse.Query("Candidates");
    q.limit(await q.count({useMasterKey: true}));
    q.descending("votes");
    return await q.find({useMasterKey: true});
  },
};