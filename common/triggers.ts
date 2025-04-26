import {createClient} from "redis";

Parse.Cloud.afterSave("Candidates", async (request) => {
  if(!(await Parse.Config.get()).get("opening")) {
    let redis = await createClient().connect();
    let candidatesJSON: {[id: string]: string;} = {};
    let q = new Parse.Query("Candidates");
    q.select("name");
    for(let candidate of await q.findAll({useMasterKey: true})) candidatesJSON[candidate.id] = candidate.get("name");
    await redis.set("candidates", JSON.stringify(candidatesJSON));
    await redis.disconnect();
  }
});

Parse.Cloud.afterDelete("Candidates", async (request) => {
  if(!(await Parse.Config.get()).get("opening")) {
    let redis = await createClient().connect();
    let candidatesJSON: {[id: string]: string;} = {};
    let q = new Parse.Query("Candidates");
    q.select("name");
    for(let candidate of await q.findAll({useMasterKey: true})) candidatesJSON[candidate.id] = candidate.get("name");
    await redis.set("candidates", JSON.stringify(candidatesJSON));
    await redis.disconnect();
  }
});