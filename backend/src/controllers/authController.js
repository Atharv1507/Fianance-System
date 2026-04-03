import { getRegisteredService } from "../models/authModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status, message, data
    });
};

const getRegisteredController = async (req, res, next) => {
    const result = await getRegisteredService();
    handleResponse(res, 200, "Registered users fetched successfully", result);
};

export default getRegisteredController;
