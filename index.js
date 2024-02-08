const cluster = require('cluster');
const os = require('os');
const express = require('express');

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
    // Get the number of CPU cores
    const numCPUs = os.cpus().length;

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

    // Define a simple route
    app.get('/', (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}, handled by worker ${process.pid}`);
    });
}
