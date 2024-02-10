const Razorpay = require('razorpay')
require('dotenv').config()
const easyinvoice = require('easyinvoice');
const {createInvoice,invoice} = require('../index')
const fs = require("fs");
const crypto = require('crypto');
const Payment = require('../modal/payment')
const { instance, data, sendmail } = require('../app')
var opt = {};

const payment = async (req, res) => {
    try {
        // userData from database
        const {clerkUserId, name, userId, mobile,amount} = req.body 
        var options = {
            amount: amount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                name:name,
                clerkUserId:clerkUserId,
                userId:userId, 
                mobile:mobile,
                GSTNO:"597bb5465b5i7tg7"
            }
        };
        opt = options;
        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            message: " order successfull",
            data: order
        })
    } catch (error) {
        console.log(error, 'error occured order can not created')
    }  
}
const paymentVerification = async (req, res) => {
    try {   

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            // Database comes here
            const message = "success"
            const {clerkUserId,name,mobile,userId} = opt.notes 
            await Payment.create({
                clerkUserId,
                name,
                userId,
                message, 
                mobile,
                razorpay_order_id,
                razorpay_payment_id,
            });
            data.information.number = "5"
            const amount = opt.amount / 100;
            data.products[0].price = amount;
            easyinvoice.createInvoice(data,function (result) { 
                //The response will contain a base64 encoded PDF file
                fs.writeFileSync("./files/invoice.pdf", result.pdf, 'base64');
            });
            //another method to create invoice
            // createInvoice(invoice, "./files/invoice.pdf") 
            sendmail();
            res.redirect(
                `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
            );
            

        } else {
            res.status(400).json({
                success: false,
            });
        }
    } catch (error) {

    }
}


module.exports = { payment, paymentVerification }