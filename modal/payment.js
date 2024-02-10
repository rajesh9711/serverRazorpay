const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  clerkUserId :{
    type: String,
    required: true,
    unique: true, 
  },
  name:{
    type:String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  message:{
    type:String,
    required: true
  },
  mobile: Number,
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Payment", paymentSchema);