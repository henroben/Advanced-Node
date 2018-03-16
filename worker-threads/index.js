const express = require('express');
const crypto = require('crypto');
const app = express();
const Worker = require('webworker-threads').Worker;


app.get('/', (req, res) => {
    const worker = new Worker(function () {
        // Worker

        // Deal with post message from Master
        this.onmessage = function () {

            let counter = 0;

            while(counter < 1e9) {
                counter++;
            }

            this.postMessage(counter);
        };


    });

    // Deal with post message from worker
    worker.onmessage = function (message) {
        console.log('counter:', message.data);
        res.send('' + message.data);
    };

    // Communicate to worker
    worker.postMessage();
});

app.get('/fast', (req, res) => {
    res.send('This was fast!');
});

app.listen(3000);