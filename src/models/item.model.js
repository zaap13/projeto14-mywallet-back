import joi from "joi";

export const itemSchema = joi.object({
  title: joi.string().required(),
  value: joi.number().required(),
  type: joi.any().valid("inflow", "outflow").required(),
});
