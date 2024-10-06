worvar express = require('express');
const axios = require('axios');
var port = 3000;
app.get('/say', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).send('keyword query parameter is required');
    }
    
    try {
        // Keyword function is deployed on AWS Lambda
        const response = await axios.get(`https://qyoq672b18.execute-api.us-east-1.amazonaws.com/TestStage/keyword`, {
            params: { keyword }
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error forwarding the request');
    }
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
