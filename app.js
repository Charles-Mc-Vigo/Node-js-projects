const express = require('express');
const app = express();
require('dotenv').config();


app.get('/',(req,res)=>{
    res.send('Hello world')
})
app.listen(process.env.PORT || 3000,()=>{
    console.log("Listening to localhost: 3000");
})

