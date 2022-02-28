"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Product = require('../models/Product'); var _Product2 = _interopRequireDefault(_Product);
var _Category = require('../models/Category'); var _Category2 = _interopRequireDefault(_Category);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class ProductController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
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

      const { filename: path } = request.file
      const { name, price, category_id, offer } = request.body

      const product = await _Product2.default.create({
        name,
        price: price,
        category_id,
        path,
        offer,
      })

      return response.json(product)
    } catch (err) {
      console.log(err)
    }
  }

  async index(request, response) {
    const products = await _Product2.default.findAll({
      include: [
        {
          model: _Category2.default,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return response.json(products)
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number(),
        offer: Yup.boolean(),
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

      const { id } = request.params

      const product = await _Product2.default.findByPk(id)

      if (!product) {
        return response
          .status(401)
          .json({ error: 'Make sure your product ID is correct' })
      }

      let path
      if (request.file) {
        path = request.file.filename
      }

      const { name, price, category_id, offer } = request.body

      await _Product2.default.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        { where: { id } }
      )

      return response.status(200).json()
    } catch (err) {
      console.log(err)
    }
  }
}

exports. default = new ProductController()
