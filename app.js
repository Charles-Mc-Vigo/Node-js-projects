const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const UserSignUp = require('./Schema/signup')
app.use(express.json())
mongoose
    .connect(process.env.MongoDBURI)
    .then(()=>{
        console.log('Connected to Accounts Database!');
    })
    .catch(err =>{
        console.log('Error Connecting to Accounts Database!')
    })

app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        
        const existingUser = await UserSignUp.findOne({ $or: [{ username: username }, { email: email }] });

        if (existingUser) {
            return res.status(400).json({ error: 'Username and Email already exist!' });
        }
        
        const newUser = await UserSignUp({username,email,password});
        await newUser.save();
        res.status(200).send('Signed Up Successfully!')
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(process.env.PORT,()=>{
    console.log(`Listening to localhost: ${process.env.PORT}`);
})

