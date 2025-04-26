process.env.PARSE_SERVER_LOGS_FOLDER = undefined;

import {AddressInfo} from "net";
import express from "express";
import {ParseServer, RedisCacheAdapter} from "parse-server";

// @ts-ignore
let server = express(), parseServer = new ParseServer({
  cacheAdapter: new RedisCacheAdapter({url: "redis://127.0.0.1:6379"}),
  databaseURI: "mongodb://localhost:27017/vote?authSource=admin",
  cloud: "main",
  appId: "myAppId",
  appName: "vote",
  masterKey: "myMasterKey",
  readOnlyMasterKey: "myReadOnlyMasterKey",
  serverURL: "http://localhost:1024",
  directAccess: false,
  allowClientClassCreation: false,
  enforcePrivateUsers: true,
});

await parseServer.start();
server.use("/", parseServer.app);
let listener = server.listen(1024, async () => {
  console.log(`parse-server-example running on port ${(listener.address() as AddressInfo).port}.`);
});