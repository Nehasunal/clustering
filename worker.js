const { parentPort } = require('worker_threads');

// Simulate a heavy computation task
function performHeavyComputation() {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
        sum += i;
    }
    return sum;
}

// Send the result back to the main thread
const result = performHeavyComputation();
parentPort.postMessage(result);
