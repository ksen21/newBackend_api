








require('dotenv').config()
const express = require('express');
// const dbConnect = require('./mongodb');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const port  = process.env.PORT || 5000

const mongoUrl = process.env.DATABASE

const BASE_URL = process.env.BASE_URL

// const bcrypt = require('bcryptjs')

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));



// require('./UserDetails.js');


mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to database")
})


const userDetailsSchema = new mongoose.Schema({
    name: String,
    email: String,
    pass: String
}, {
    collection: "newUserInfo"
})


const User = new mongoose.model("newUserInfo", userDetailsSchema);


//! Routes 


app.get('/', (req, res) => {

    res.send("API MY");
    console.log("my api");


});


app.post('/signup', async (req, res) => {
    // const salt = await bcrypt.genSalt(10); 
    // const secPass = await bcrypt.hash(req.body.pass,salt) 

    const { name, email,pass } = req.body;

     const user  = await User.findOne({ email: email })
        
            if(user)
            {
                res.send({ message: "User already registerd", user })
            }else
                {

                    const user = new User({
                        name:name,
                        email:email,
                        pass:pass
                })

                await user.save();
                console.log(user);
                res.send({ message: "Successfully added user", user });

            //    await user.save().then((err, result) => {
            //         if (err) {
            //             res.send(err)
            //         } else {
            //             res.send({ message: "Successfully added user", user });
            //         }
            //     })

            }        
        
}
)


// res.send("API MY",);
// console.log(req.body);


app.post('/login', async (req, res) => {


    const { email, pass } = req.body;


    const user = await User.findOne({ email: email })


    if (user) {
        
        if(pass === user.pass)
        {
            return res.status(200).send({
                success: true,
                message: "Login Succefully",
                user: user
            })
        }
        else{
               return res.status(201).send(
                {
                    success: false,
                    message: "Invalid Password"  
        
                });
        }
     

    }

    console.log(user);

    res.status(201).send(
        {
            success: false,
            message: "User not found",
            user: user
        });



});



app.listen(port, () => {
    console.log('Server started at 5000 port');
})








