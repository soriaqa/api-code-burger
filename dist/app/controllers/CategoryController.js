"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Category = require('../models/Category'); var _Category2 = _interopRequireDefault(_Category);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class CategoryController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      })

      try {
        await schema.validateSync(request.body, { abortEarly: false })
      } catch (err) {
        return response.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await _User2.default.findByPk(request.userId)

      if (!isAdmin) {
        return response.status(401).json()
      }

      const { name } = request.body

      const { filename: path } = request.file

      const categoryExists = await _Category2.default.findOne({
        where: {
          name,
        },
      })

      if (categoryExists) {
        return response.status(400).json({ error: 'Category already exists' })
      }

      const { id } = await _Category2.default.create({ name, path })

      return response.json({ id, name })
    } catch (err) {
      console.log(err)
    }
  }

  async index(request, response) {
    const category = await _Category2.default.findAll()

    return response.json(category)
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
      })

      try {
        await schema.validateSync(request.body, { abortEarly: false })
      } catch (err) {
        return response.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await _User2.default.findByPk(request.userId)

      if (!isAdmin) {
        return response.status(401).json()
      }

      const { name } = request.body

      const { id } = request.params

      const category = await _Category2.default.findByPk(id)

      if (!category) {
        return response
          .status(401)
          .json({ error: 'Make sure your category id is correct' })
      }

      let path
      if (request.file) {
        path = request.file.filename
      }

      await _Category2.default.update({ name, path }, { where: { id } })

      return response.status(200).json()
    } catch (err) {
      console.log(err)
    }
  }
}

exports. default = new CategoryController()
