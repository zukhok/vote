import functions from "./functions.js";

Parse.Cloud.define("getCandidates", async (request) => {
  try {
    return {
      candidates: await functions.getCandidates(),
      code: 0,
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("vote", async (request) => {
  let userId = request.user?.id, {ids} = request.params;
  try {
    let c = await functions.vote(userId!, ids);
    let candidates: {[id: string]: {name: string, votes: number;};} = {};
    for(let candidate of c) candidates[candidate.id] = {name: candidate.get("name"), votes: candidate.get("votes")};
    return {
      candidates,
      code: 0
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("getMyVotes", async (request) => {
  let userId = request.user?.id;
  try {
    let c = await functions.getMyVotes(userId!);
    let candidates: {[id: string]: {name: string, votes: number;};} = {};
    for(let candidate of c) candidates[candidate.id] = {name: candidate.get("name"), votes: candidate.get("votes")};
    return {
      candidates,
      code: 0
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("admin-addCandidates", async (request) => {
  let userId = request.user?.id, {names} = request.params;
  try {
    let c = await functions.addCandidates(userId!, names);
    let candidates: {[id: string]: {name: string, votes: number;};} = {};
    for(let candidate of c) candidates[candidate.id] = {name: candidate.get("name"), votes: candidate.get("votes")};
    return {
      candidates,
      code: 0
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("admin-updateCandidates", async (request) => {
  let userId = request.user?.id, {candidates} = request.params;
  try {
    let c = await functions.updateCandidates(userId!, candidates);
    candidates = {};
    for(let candidate of c) candidates[candidate.id] = {name: candidate.get("name"), votes: candidate.get("votes")};
    return {
      candidates,
      code: 0
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("admin-getCandidates", async (request) => {
  let userId = request.user?.id;
  try {
    let c = await functions.adminGetCandidates(userId!);
    let candidates: {[id: string]: {name: string, votes: number;};} = {};
    for(let candidate of c) candidates[candidate.id] = {name: candidate.get("name"), votes: candidate.get("votes")};
    return {
      candidates,
      code: 0
    };
  }
  catch(e) {
    return {code: e};
  }
});