process.env.UV_THREADPOOL_SIZE = 1;

// Node's default thread pool is 4
// with 4 threads, doRequest will complete first, as network is handled by OS, therefore outside thread pool,
// fs and crypto will be assigned to threads, fs will request stats from HD about file and then be free for last doHash
// to be assigned to it, first doHash() to complete will free up thread for fs to read file and complete
// so order will be: doRequest(), doHash(), fs, doHash(), doHash(), doHash()
// With 1 thread order will be: doRequest(), doHash(), doHash(), doHash(), doHash(), fs
// With 5 threads, order will be fs, doRequest(), doHash(), doHash(), doHash(), doHash() as the five functions each have a thread

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
    https.request('https://www.google.com', res => {
        res.on('data', () => {});
        res.on('end', () => {
            console.log(Date.now() - start);
        });
    }).end();
}

function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('Hash:', Date.now() - start);
    });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
    console.log('FS:', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();