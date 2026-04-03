import { createUserService } from "../models/userModel.js"

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status, message, data
  });
};

export const createUser = async (req, res, next) => {
  try {
    const { name, id } = req.body;
    const result = await createUserService(name, id);
    handleResponse(res, 200, "User created successfully", result);

  }
  catch (err) {
    next(err)
  }
}