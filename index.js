const cluster = require('cluster');
const os = require('os');
const express = require('express');
const { Worker } = require('worker_threads'); // Import worker threads
const { fork } = require('child_process'); // Import child processes

const PORT = process.env.PORT || 3000;

// Get the number of CPU cores
const numCPUs = os.cpus().length;

if (cluster.isMaster) {   

    console.log(`Master ${process.pid} is running`);

    // Fork workers based on the number of CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // If a worker dies, start a new worker
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    // This block runs for each worker
    const app = express();

    // Middleware to log which worker is handling the request
    app.use((req, res, next) => {
        console.log(`Worker ${process.pid} is handling the request`);
        next();
    });

    // Route using worker thread
    app.get('/heavy-task', (req, res) => {
        const worker = new Worker('./worker.js'); // Create a new worker thread

        worker.on('message', (message) => {
            res.send(`Worker thread result: ${message}`);
        });

        worker.on('error', (err) => {
            res.status(500).send(`Worker thread error: ${err.message}`);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker thread stopped with exit code ${code}`);
            }
        });
    });

     // Route using child process
     app.get('/child-process', (req, res) => {
        const child = fork('./childprocess.js'); // Fork a new child process

        child.on('message', (message) => {
            res.send(`Child process result: ${message}`);
        });

        child.on('error', (err) => {
            res.status(500).send(`Child process error: ${err.message}`);
        });

        child.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Child process stopped with exit code ${code}`);
            }
        });
    });

    // Basic route
    app.get('/', (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}, handled by worker ${process.pid}`);
    });
}
