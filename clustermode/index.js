// For use with pm2
// run following command to start using all available cpu's
// pm2 start index.js -i 0
// to stop:
// pm2 stop index
const express = require('express');
const crypto = require('crypto');
const app = express();


app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        res.send('Hi There');
    });
});

app.get('/fast', (req, res) => {
    res.send('This was fast!');
});

app.listen(3000);

