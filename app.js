const express = require('express');
const app = express();
const path = require('path')
require('dotenv').config();
const mongoose = require('mongoose');
const UserSignUp = require('./Schema/signup')
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const publicFolderPath = path.join(__dirname,'public');
app.use(express.static(publicFolderPath));
mongoose
    .connect(process.env.MongoDBURI)
    .then(()=>{
        console.log('Connected to Accounts Database!');
    })
    .catch(err =>{
        console.log('Error Connecting to Accounts Database!')
    })

app.get('/',(req,res)=>{
    res.sendFile(path.join(publicFolderPath, 'landingpage.html'))
})

app.get('/admin/accounts', async (req,res)=>{
    try{
        const accounts = await UserSignUp.find();
        res.send(accounts)
    }
    catch(err){
        res.status(500).send('Error occur')
    }
})
app.get('/admin/accounts/:id', async (req,res)=>{
    try{
        const accountId = req.params.id;
        const account = await UserSignUp.findById(accountId);
        if (!account) {
            return res.status(404).send('Account not found');
        }
        res.send(account);
    }
    catch(err){
        console.error('Error fetching account:', err);
        res.status(500).send('Error occurred while fetching account');
    }
})
app.delete('/admin/accounts/:id', async (req,res)=>{
    try{
        const accountId = req.params.id;
        const account = await UserSignUp.findByIdAndDelete(accountId);
        if (!account) {
            return res.status(404).send('Account not found');
        }
        res.send('Account Deleted Successfully!');
    }
    catch(err){
        console.error('Error fetching account:', err);
        res.status(500).send('Error occurred while fetching account');
    }
})

app.put('/admin/accounts/:id', async (req,res)=>{
    try{
        const accountId = req.params.id;
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ error: 'At least one field (username, email, password) must be provided for update' });
        }

        const updateField = {};
        if(username) updateField.username = username;
        if(email) updateField.email = email;
        if(password) updateField.password = password;

        const updatedAccount = await UserSignUp.findByIdAndUpdate(accountId,updateField, {new:true})
        if (!updatedAccount) {
            return res.status(404).send('Account not found');
        }

        res.status(200).send('Account updated successfully');

    }
    catch(err){
        console.log('Error Updating Account',err);
        res.status(500).send('Error occured while updating account')
    }
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

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Check if the provided username exists in the database
        const user = await UserSignUp.findOne({ username });

        // If user with the provided username doesn't exist or password doesn't match, return error
        if (!user || user.password !== password) {
            return res.status(401).send('Invalid username or password');
        }

        // If login is successful, you can respond with a success message or redirect the user
        res.status(200).send('Log In Successful');
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(process.env.PORT,()=>{
    console.log(`Listening to localhost: ${process.env.PORT}`);
})

