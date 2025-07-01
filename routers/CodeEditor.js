const express = require('express');
const axios = require('axios');
const router = express.Router();
const base64 = require('base-64');


const executeCode = async (language, code) => {
    const languageMappings = {
        'python': 71,
        'java': 62,
        'c_cpp': 54
    };

    const source_code = base64.encode(code);
    const language_id = languageMappings[language];

    try {
        const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true', {
            source_code,
            language_id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': '090edcf3damsha8b670058409d70p157097jsn8107d76181f0'
            }
        });

        const token = response.data.token;

        const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': '090edcf3damsha8b670058409d70p157097jsn8107d76181f0'
            }
        });

        if (resultResponse.data.stdout) {
            return base64.decode(resultResponse.data.stdout);
        } else if (resultResponse.data.stderr) {
            return base64.decode(resultResponse.data.stderr);
        } else {
            return 'No output';
        }
    } catch (error) {
        console.error('Error executing code:', error);
        return 'Error executing code';
    }
};

router.post('/execute', async (req, res) => {
    const { language, code } = req.body;

    if (!['python', 'java', 'c_cpp'].includes(language)) {
        return res.status(400).send({ output: 'Unsupported language' });
    }

    const output = await executeCode(language, code);
    res.send({ output });
});

module.exports = router;