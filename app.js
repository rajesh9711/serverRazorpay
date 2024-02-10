const Razorpay = require('razorpay')
const nodemailer = require('nodemailer');
const Payment = require('./modal/payment')
const path = require('path');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});


// change for invoice
const data = {
    apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
    mode: "development", // Production or development, defaults to production   
    images: {
        // The logo on top of your invoice
        logo: "https://images.unsplash.com/photo-1705921321186-fbc9b2c8f542?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
        // The invoice background
        background: ""
    },
    // Your own data
    sender: {
        company: "Multyfi",
        address: "Gurugram Building 9B",
        zip: "1234 AB",
        city: "Haryana",
        country: "India"
    },
    // Your recipient
    client: {
        Name: "Rajesh kumar",
        address: "xyz uttam Nagar New Delhi 110059",
        zip: "110059 ",
        city: "New Delhi",
        country: "India"
    },
    information: {
        // Invoice number
        number: "1",
        // Invoice data
        date: "12-12-2021",
        // Invoice due date
        dueDate: "31-12-2021"
    },
    products: [
        {
            quantity: 1,
            description: "Product 1",
            taxRate: 6,
            price: 33.87
        }
    ],
    // The message you would like to display on the bottom of your invoice
    bottomNotice: "Thank You For subscription.",
    // Settings to customize your invoice
    settings: {
        locale: 'en-IN',
        currency: "INR",

    },

    translate: {
        Name: "nothing to explain"
    },

};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajesh.kumar.ug20@nsut.ac.in',
        pass: process.env.Mail_Pass
    }
});

//for successful payment
const mailOptions = {
    from: 'rajesh.kumar.ug20@nsut.ac.in',
    to: 'rk971102@gmail.com',
    subject: 'Invoice',
    text: 'Thank You for Choosing Our Service',
    html: '<h1>Payment Successful</h1>',
    attachments: [{
        filename: 'file.pdf',
        path: './files/invoice.pdf',
        contentType: 'application/pdf'
    }],
}
//for unsuccessful payment
const mailOptions2 = {
    from: 'rajesh.kumar.ug20@nsut.ac.in',
    to: 'rk971102@gmail.com',
    subject: 'Payment failed',
    text: 'Hello this is our testing gmail',
    html: '<h3>Sorry payment failed please try again </h3>'
}
function sendmail() {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
function failedmail(req, res) {
    const {name,message,razorpay_order_id,razorpay_payment_id,clerkUserId,userId,mobile} = req.body
    Payment.create({
        clerkUserId,
        name,
        userId,
        message,
        mobile,
        razorpay_order_id,
        razorpay_payment_id
    })
    transporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    res.send(data)
}
module.exports = { instance, data, sendmail, failedmail }