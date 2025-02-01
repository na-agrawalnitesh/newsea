const express = require('express');
const router = express.Router();
const { findUrlByQueryId } = require('../services/urlService');

router.get('/', async (req, res) => {
    try {
        const referrerHeader = req.get('Referer');
        if (!referrerHeader) {
            console.log("No referrer URL provided");
        }
        const sourceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const destinationUrl = await findUrlByQueryId(sourceUrl, referrerHeader);
        if (!destinationUrl) {
            return res.status(404).json({ message: 'Destination URL not found' });
        }

        //         // Send HTML with META refresh instead of direct redirect
        //         const html = `
        // <!DOCTYPE html>
        // <html>
        //     <head>
        //         <meta http-equiv="refresh" content="0; url=${destinationUrl}">
        //     </head>
        // </html>`;
        //         res.send(html);
        res.setHeader('Referer', sourceUrl);
        res.redirect(302, destinationUrl);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router; 