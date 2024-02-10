const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config();
const router = require('./routes/router')
const app = express();
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use('/', router)
connectDB()

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running at Port  ${PORT}`);

})
app.get('/getkey',(req,res)=> res.status(200).json({key:process.env.RAZORPAY_KEY}))