// Simulate a heavy computation task
function performChildTask() {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
        sum += i;
    }
    return sum;
}

// Send the result back to the parent process
process.send(performChildTask());