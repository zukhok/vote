import {config, transport} from "../common/nodemailer.js";
import functions from "./functions.js";

Parse.Cloud.define("signUp", async (request) => {
  let {email, password} = request.params;
  try {
    if(!email || !password) throw -1;
    let user = await functions.signUp(email, password);
    transport.sendMail({
      from: `"web"<${config.auth.user}>`,
      subject: "激活账号",
      to: email,
      html: `激活账号${user.id}`,
    }, e => console.error(e));
    return {
      email,
      code: 0,
    };
  }
  catch(e) {
    console.error(e);
    return {code: e};
  }
});

Parse.Cloud.define("activate", async (request) => {
  let {userId} = request.params;
  try {
    if(!userId) throw -1;
    return {
      sessionToken: (await functions.activate(userId)).getSessionToken(),
      code: 0,
    };
  }
  catch(e) {
    return {code: e};
  }
});

Parse.Cloud.define("logIn", async (request) => {
  let {email, password} = request.params;
  try {
    if(!email || !password) throw -1;
    return {
      sessionToken: (await functions.logIn(email, password)).getSessionToken(),
      code: 0,
    };
  }
  catch(e) {
    return {code: e};
  }
});