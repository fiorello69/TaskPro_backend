import HttpError from "../helpers/HttpError.js";

function validateBody(shema) {
  async function func(req, _res, next) {
    const { error } = shema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  }
  return func;
}
export default validateBody;
