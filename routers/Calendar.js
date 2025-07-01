// server/routes/contests.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/codeforces', async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const contests = response.data.result;
        const upcomingContests = contests.filter(contest => contest.phase === 'BEFORE');
        res.json(upcomingContests);
    } catch (error) {
        res.status(500).send('Error fetching contests from Codeforces');
    }
});

module.exports = router;
