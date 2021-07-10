const Joi = require("joi")

module.exports = {
  registerValidation: (data) => {
    const schema = Joi.object({
      username: Joi.string().max(50).min(3).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).required(),
      role: Joi.string().required(),
      gender: Joi.string().max(4).required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().min(6).required(),
    })
    return schema.validate(data)
  },

  loginValidation: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    })
    return schema.validate(data)
  },

  productValidation: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      buyingPrice: Joi.number().positive().required(),
      amount: Joi.number().positive().required(),
      pricePerUnit: Joi.number().positive().required(),
      description: Joi.string(),
      //dateOfExpry: Joi.date().required()
    })
    return schema.validate(data)
  },
}
