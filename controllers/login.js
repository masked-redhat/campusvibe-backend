import db from "../database/login.js";
import { tokenize } from "../middleware/authentication.js";

class User {
  #uid;
  #blacklisted;

  constructor(params) {
    this.username = params?.username;
    this.password = params?.password;

    this.#uid = null;
    this.#blacklisted = false;
  }

  async getUser() {
    let user = await db.getUserByUsernamePassword(this.username, this.password);

    this.setIdBlacklist(user);
  }

  async createUser() {
    let user = await db.createUser(this.username, this.password);

    this.setIdBlacklist(user);
  }

  getUserData() {
    let userData = {
      uid: this.#uid,
      username: this.username,
      blacklist: this.#blacklisted,
    };

    return userData;
  }

  getJwtToken() {
    return tokenize(this.getUserData());
  }

  getUserId() {
    return this.#uid;
  }

  isBlacklisted() {
    return this.#blacklisted;
  }

  isValidUser() {
    return this.isBlacklisted;
  }

  isUser() {
    return (this.#uid ?? null) !== null;
  }

  setIdBlacklist(user) {
    this.#uid = user?.id;
    this.#blacklisted = user?.blacklist ?? true;
  }
}

export default User;
