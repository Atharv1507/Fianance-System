import { getAllAnalyticsService } from "../models/analyzerModel.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status, message, data
  });
};


export const getAllRecords = async (req, res, next) => {
  try {
    const result = await getAllAnalyticsService()
    handleResponse(res, 200, "All records fetched successfully", result)
  } catch (err) {
    next(err)
  }
}
