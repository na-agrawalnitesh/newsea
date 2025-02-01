const urlService = require("../services/urlService");
const jwt = require('jsonwebtoken');

const createUrl = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization token is required" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { url_id, name, note, source, destination } = req.body;
        const result = await urlService.createUrl(url_id, note, name, source, destination, userId);
        
        if (!result.success) {
            return res.status(result.status).json({
                status: "error",
                message: result.message
            });
        }

        return res.status(result.status).json({
            status: "success",
            data: result.data,
            message: "URL created successfully"
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        return res.status(400).json({ error: error.message });
    }
};

const getUrl = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Authorization token is required" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const url = await urlService.getUrl(userId);
        res.status(200).json({ status: "success", data: url, message: "Url fetched successfully" });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(400).json({ error: error.message });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const id = req.params.urlId;
        await urlService.deleteUrl(id);
        res.status(200).json({ status: "success", message: "Url deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUrl = async (req, res) => {
    try {
        const id = req.params.urlId;        
        const { url_id, note, name, source, destination } = req.body;
        const url = await urlService.updateUrl(id, url_id, name, note, source, destination);
        res.status(200).json({ status: "success", data: url, message: "Url updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUrl,
    getUrl,
    deleteUrl,
    updateUrl,
};