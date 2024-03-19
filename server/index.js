const express = require('express');
const cors = require('cors');
const RegisterAndLogin = require("./routes/RegisterAndLogin.js");
const mongoose = require('mongoose');
const mongoDBURL = require('./config.js');

const app = express();
const PORT = 5500;
app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send('mannjadwani')
})

app.use('/api', RegisterAndLogin);


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });