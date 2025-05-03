require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const app = express();
app.use(bodyParser.json());

app.post('/daisysms', async (req, res) => {
    const data = req.body;

    if (!data || !data.text || !data.code) {
        return res.status(400).send('Invalid payload');
    }

    const embed = {
        title: '📩 New SMS Received',
        fields: [
            { name: 'Activation ID', value: String(data.activationId), inline: true },
            { name: 'Service', value: data.service || 'Unknown', inline: true },
            { name: 'Code', value: data.code, inline: true },
            { name: 'Text', value: data.text },
            { name: 'Received At', value: data.receivedAt || new Date().toISOString() }
        ],
        color: 0x00ff99,
        timestamp: new Date().toISOString()
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [embed]
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Error sending to Discord webhook:', err.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
