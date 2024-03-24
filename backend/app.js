const express = require('express');
const app = express();
require('dotenv').config();

app.get('/',(req,res)=>{
  res.send('Hellow World')
})
app.listen(process.env.PORT,()=>{
  console.log('App is running..')
})