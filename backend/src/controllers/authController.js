import { getUserRoleService, getRegisteredService } from "../models/authModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status, message, data
    });
};

export const getRegistered = async (req, res, next) => {
    try {

        const result = await getRegisteredService();
        handleResponse(res, 200, "Registered users fetched successfully", result);
    }
    catch (err) { next(err) }
};

export const getUserRole = async (req, res, next) => {
    try {
        const result = await getUserRoleService(req.params.id);
        handleResponse(res, 200, "User role fetched successfully", result);
    }
    catch (err) {
        next(err)
    }
}
