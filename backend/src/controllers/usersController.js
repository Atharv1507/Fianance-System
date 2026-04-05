import { createUserService, createTransactionService, getMyTransactionsService, updateTransactionService } from "../models/userModel.js"

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

export const createTransaction = async (req, res, next) => {
  try {
    const { id, amount, type, category, notes } = req.body;
    const result = await createTransactionService(id, amount, type, category, notes);
    handleResponse(res, 200, "Transaction created successfully", result);
  }
  catch (err) {
    next(err)
  }
}

export const getMyTransactions = async (req, res, next) => {
  try {
    const result = await getMyTransactionsService(req.params.id);
    handleResponse(res, 200, "Transactions fetched successfully", result);
  }
  catch (err) {
    next(err)
  }
}

export const updateTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, notes, userId } = req.body;
    const result = await updateTransactionService(req.params.id, userId, amount, type, category, notes);
    if (!result) {
      return handleResponse(res, 404, "Transaction not found or unauthorized");
    }
    handleResponse(res, 200, "Transaction updated successfully", result);
  }
  catch (err) {
    next(err)
  }
}