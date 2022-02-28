"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

var _Product = require('../app/models/Product'); var _Product2 = _interopRequireDefault(_Product);
var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Category = require('../app/models/Category'); var _Category2 = _interopRequireDefault(_Category);

var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

const models = [_User2.default, _Product2.default, _Category2.default]

class Database {
  constructor() {
    this.init()
    // this.mongo()
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    this.mongoConnection = _mongoose2.default.connect(
      'mongodb://localhost:27017/codeburger',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  }
}

exports. default = new Database()
