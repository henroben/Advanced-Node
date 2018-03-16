process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// Is the file being executed in master mode?
if(cluster.isMaster) {
    cluster.fork(); // forks a child instance of index.js
    cluster.fork(); // forks a child instance of index.js
} else {
    // Child mode, run server

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
}

