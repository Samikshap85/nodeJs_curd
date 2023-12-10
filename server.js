const dotenv = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');
const app = express() //from documentation
const Product = require('./models/productModel')
dotenv.config({path:'./config.env'});

app.use(express.json()); //middleware

//routes
app.get('/' , (req,res) => {
    res.send('Hello Node API');

})

app.get('/products', async(req,res)=>{
    try{
        const products = await Product.find({}) //it will get all products
        res.status(200).json(products);

    }catch(error){
        res.status(500).json({message:error.message})

    }
})

app.get('/products/:id', async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({message:error.message})

    }
})



app.post('/products', async(req , res) => {
    try{
        const products = await Product.create(req.body) //saving data to db
        res.status(200).json(products);

    }catch(error){
        console.log(error.message);
        res.status(500).json({message:error.message})

    }
})

app.put('/products/:id' , async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        //we cannot find any product in db
        if(!product){
            return res.status(404).json({message:`cannot find any product with Id ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    }catch(error){
        res.status(500).json({message:error.message})

    }
})

app.delete('/products/:id' , async(req, res) =>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:`cannot find any product with id ${id}`})
        }
        res.status(200).json(product);


    }catch(error){
        res.status(500).json({message:error.message})
    }
})



const DB = process.env.DATABASE;
mongoose.connect(DB)
.then(()=>{
    console.log('connected to mongodb')
    app.listen(3000, ()=>{
        console.log("Node API app is running on port 3000");
    })

}).catch((error) => {
    console.log(error)
})