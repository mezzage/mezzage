require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const ZCASH_RPC = {
    url: process.env.ZCASH_RPC_URL,
    auth: {
        username: process.env.ZCASH_RPC_USER,
        password: process.env.ZCASH_RPC_PASSWORD
    }
};

async function zcashRPC(method, params = []) {
    try {
        const response = await axios.post(ZCASH_RPC.url, {
            jsonrpc: '1.0',
            id: Date.now().toString(),
            method: method,
            params: params
        }, {
            auth: ZCASH_RPC.auth
        });
        
        return response.data.result;
    } catch (error) {
        console.error('Zcash RPC Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || error.message);
    }
}

app.get('/api/info', async (req, res) => {
    try {
        const info = await zcashRPC('getinfo');
        res.json({
            success: true,
            data: info
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});