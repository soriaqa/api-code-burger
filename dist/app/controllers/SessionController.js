"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: 'Make sure your password or email are correct' })
    }

    if (!(await schema.isValid(request.body))) userEmailOrPasswordIncorrect()

    const { email, password } = request.body

    const user = await _User2.default.findOne({
      where: { email },
    })

    if (!user) userEmailOrPasswordIncorrect()

    if (!(await user.checkPassword(password))) userEmailOrPasswordIncorrect()

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: _jsonwebtoken2.default.sign({ id: user.id, name: user.name }, _auth2.default.secret, {
        expiresIn: _auth2.default.expiresIn,
      }),
    })
  }
}

exports. default = new SessionController()
