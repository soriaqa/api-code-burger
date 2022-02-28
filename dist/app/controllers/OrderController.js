"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Product = require('../models/Product'); var _Product2 = _interopRequireDefault(_Product);
var _Category = require('../models/Category'); var _Category2 = _interopRequireDefault(_Category);
var _Order = require('../schemas/Order'); var _Order2 = _interopRequireDefault(_Order);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const productsId = request.body.products.map((product) => product.id)

    const updatedProducts = await _Product2.default.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: _Category2.default,
          as: 'category',
          attributes: ['name'],
        },
      ],
    })

    const editedProduct = updatedProducts.map((product) => {
      const productIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      }

      return newProduct
    })

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: editedProduct,
      status: 'Pedido realizado',
    }

    const orderResponse = await _Order2.default.create(order)

    return response.status(201).json(orderResponse)
  }

  async index(request, response) {
    const orders = await _Order2.default.find()

    return response.json(orders)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
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
    const { status } = request.body

    try {
      await _Order2.default.updateOne({ _id: id }, { status })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }

    return response.json({ message: 'Status updated sucessfully' })
  }
}

exports. default = new OrderController()
