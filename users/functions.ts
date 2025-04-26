export default {
  async signUp(email: string, password: string) {
    let u = new Parse.User();
    u.setEmail(email);
    u.setUsername(email);
    u.setPassword(password);
    u.set("activated", false);
    return await u.signUp(undefined, {useMasterKey: true});
  },

  async activate(userId: string) {
    let q = new Parse.Query(Parse.User);
    let u = await q.get(userId, {useMasterKey: true});
    if(!u) throw -1;
    u.set("activated", true);
    return await u.save(undefined, {useMasterKey: true});
  },

  async logIn(email: string, password: string) {
    let q = new Parse.Query(Parse.User);
    q.equalTo("email", email);
    let u = await q.first({useMasterKey: true});
    if(!u) throw -1;
    if(u.get("activated") == false) throw -2;
    return Parse.User.logIn(email, password, {useMasterKey: true});
  },
};