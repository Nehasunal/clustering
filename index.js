const express = require('express');
const app = express();


function doWork(duration){  
    // this function will block our event loop for 5 sec, 
    // it wont let us execute other function or task.
    // hit localhost in 2 diff tabs, second will give response once first 5 sec is completed.
    // Clustering will solve this issue.
    const start = Date.now();
    while(Date.now() - start < duration){}
}


app.get('/',function(req,res){
    doWork(5000) // 5 sec
    res.send("hello");
})


app.listen(9000,()=>{
    console.log("start server");
})