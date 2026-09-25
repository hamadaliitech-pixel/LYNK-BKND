const { body, validationResult } = require("express-validator");

async function validationrerror(req, res,next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({
      errors: errors.array(),
    });
  }
  next();
}

const RegisterValidation = [
  body("username")
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be btw 3 to 20 char"),
  body("email").isEmail().withMessage("Unvalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 number or char"),
  validationrerror,
];

module.exports = { RegisterValidation };
