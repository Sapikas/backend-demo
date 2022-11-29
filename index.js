const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');
const PORT = process.env.PORT || 4000;
const DB_CONNECTION = process.env.DB_CONNECTION;
const api = process.env.API_URL;

const userRouter = require('./routers/users');
const dietitianRouter = require('./routers/dietAgencies');
const diets = require('./routers/diets');

const app = express();

//middlewares
const whitelist = ['https://www.google.com', 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

//routers
app.use(`${api}/users`, userRouter);
app.use(`${api}/dietagencies`, dietitianRouter);
app.use(`${api}/diets`, diets);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose.connect(DB_CONNECTION)
.then(()=>{
    console.log('DB CONNECTED');
})
.catch((err)=>{
    console.log(err);
})

app.listen(PORT, ()=>{
    console.log(`The server is running in port ${PORT}`);
})