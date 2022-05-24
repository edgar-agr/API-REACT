const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const plantsRoutes = require('./routes/plants');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(plantsRoutes);

app.use((error,req,res,next)=>{
    console.log(error);
    const code = error.statusCode  || 500;
    const message = error.message;
    const data = error.data;
    res.status(code)
    .send({
        message:message,
        data:data
    });
});

mongoose
    .connect(
        'mongodb+srv://Edgar:12345@cluster0.yfixe.mongodb.net/Vivero?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })

