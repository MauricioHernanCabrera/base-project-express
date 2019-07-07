const { UserModel } = require('./../models');
const bcrypt = require('bcrypt');

class UserService {
  getUser(filter) {
    return UserModel.findOne(filter);
  }

  async createUser({ data }) {
    const { username, email, password } = data;
    return UserModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10)
    });
  }
}

module.exports = UserService;
