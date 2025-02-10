import Joi from "joi";

const DocumentStateEnum = ["DENY", "ACCESS", "REJECT"];

export class ValidateExpression {
  static login = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().allow(null),
  });

  static patching = Joi.object({
    email: Joi.string().email().required(),
  });
  static create = Joi.object({
    title: Joi.string().required(),
    state: Joi.string()
      .valid(...DocumentStateEnum)
      .optional(),
    userCreatedId: Joi.number().optional(),
    aim: Joi.string().max(200).required(),
    intro: Joi.string().max(200).required(),
    employee: Joi.string().max(80).optional(),
    jobposition: Joi.string().max(100).optional(),
    authId: Joi.number().optional()
  });
  static detail = Joi.object({
    intro: Joi.string().max(200).required(),
    aim: Joi.string().max(200).required(),
    documentId: Joi.string().required(),
  });
  static attribute = Joi.object({
    id: Joi.string().required(),
    categoryMain: Joi.string().max(250).required(),
    category: Joi.string().max(250).required(),
    value: Joi.string().optional(),
  });
  static risk = Joi.object({
    id: Joi.string().required(),
    riskDescription: Joi.string().required(),
    riskLevel: Joi.number().required(),
    affectionLevel: Joi.number().required(),
    mitigationStrategy: Joi.string().optional(),
  });
  static testcase = Joi.object({
    id: Joi.string().required(),
    category: Joi.string().max(100).required(),
    types: Joi.string().max(100).required(),
    steps: Joi.string().required(),
    result: Joi.string().max(100).required(),
    division: Joi.string().max(100).required(),
  });
  static budget = Joi.object({
    id: Joi.string().required(),
    productCategory: Joi.string().required(),
    product: Joi.string().required(),
    amount: Joi.number().required(),
    priceUnit: Joi.number().optional(),
    priceTotal: Joi.number().optional(),
  });
  static schedules = Joi.object({
    id: Joi.string().required(),
    employee: Joi.string().required(),
    role: Joi.string().max(100).required(),
    created: Joi.date().required(),
    ended: Joi.date().required(),
  });
}
