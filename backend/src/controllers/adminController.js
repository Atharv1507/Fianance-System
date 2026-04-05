import { getUsersService, editUserService, deleteUserService } from "../models/adminModel.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status, message, data
  });
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService();
    handleResponse(res, 200, "Users fetched successfully", result);
  }
  catch (err) {
    next(err)
  }
}

export const editUser = async (req, res, next) => {
  try {
    const { name, role, status } = req.body;
    const result = await editUserService(name, req.params.id, role, status);
    handleResponse(res, 200, "User edited successfully", result);
  }
  catch (err) {
    next(err)
  }
}
export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);
    handleResponse(res, 200, "User deleted successfully", result);
  }
  catch (err) {
    next(err)
  }
}