const Url = require("../models/urlModel");

const createUrl = async (url_id, name, note, source, destination, user_id) => {
    const url = new Url({ url_id, name, note, source, destination, user_id: user_id });
    try {
        await url.save();
        return { success: true, data: url, status: 201 };
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const duplicateValue = error.keyValue[field];
            const errorMessage = `This ${field.replace('_', ' ')} "${duplicateValue}" is already in use. Please choose a different one.`;
            
            return { 
                success: false, 
                message: errorMessage,
                status: 409
            };
        }
        return { 
            success: false, 
            message: error.message,
            status: 400
        };
    }
};

const getUrl = async (userId) => {
    try {
        const url = await Url.find({ user_id: userId });
        return url;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteUrl = async (urlId) => {
    try {
        await Url.deleteOne({ _id: urlId });
    } catch (error) {
        throw new Error(error);
    }
};

const updateUrl = async (id, urlId, name, note, source, destination) => {
    try {
        await Url.updateOne({ _id: id }, { url_id: urlId, note, name, source, destination });
    } catch (error) {
        throw new Error(error);
    }
};

const findUrlByQueryId = async (sourceUrl, referrerHeader) => {
    try {
        // Parse the URL to get query parameters
        const sourceUrlObj = new URL(sourceUrl);
        const queryParams = Object.fromEntries(sourceUrlObj.searchParams);

        // First check if we have an id parameter
        if (!queryParams.id) {
            throw new Error('URL id parameter is required');
        }

        const url = await Url.findOne({ url_id: queryParams.id });
        if (!url) {
            throw new Error(`URL not found for id: ${queryParams.id}`);
        }

        const destinationUrlObj = new URL(url.destination);
        for (const [key, value] of Object.entries(queryParams)) {
            if (value && key !== 'id') {  // Only add non-empty query parameters
                destinationUrlObj.searchParams.set(key, value);
            }
        }

        await Url.updateOne(
            { _id: url._id },
            {
                source: sourceUrl,
                destination: destinationUrlObj.toString()
            }
        );
        return destinationUrlObj.toString();
    } catch (error) {
        console.error('Error finding URL:', error);
        throw error;
    }
};

module.exports = { createUrl, getUrl, deleteUrl, updateUrl, findUrlByQueryId };