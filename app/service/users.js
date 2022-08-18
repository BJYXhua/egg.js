'use strict';

const Service = require('egg').Service;
class UsersService extends Service {
  async getUser(id) {
    return {
      id,
      name: '海绵宝宝',
      age: 19,
    };
  }
  async getUsers(id, name) {
    return {
      id,
      name,
      age: 19,
    };
  }
}

module.exports = UsersService;
