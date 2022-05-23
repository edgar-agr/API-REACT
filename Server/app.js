const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = requre('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());


mongoose
    .connect(
        'mongodb+srv://Edgar:<password>@cluster0.yfixe.mongodb.net/Vivero?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })

