const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//importing models
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const verifyToken = require('./verifyToken');

//databse connection

mongoose
  .connect("mongodb://localhost:27017/Nutrify")
  .then(() => {
    console.log("Database Connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());

//endpoint for registering user
app.post("/register", (req, res) => {
  let user = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (!err) {
          user.password = hpass;
          try {
            let doc = await userModel.create(user);
            res.status(201).send({ message: "user registered successfully" });
          } catch {
            (err) => {
              console.log(err);
              res.status(500).send({ message: "some problem" });
            };
          }
        }
      });
    }
  });
});

//endpoint for login
app.post("/login", async (req, res) => {
  let userCred = req.body;
  try {
    const user = await userModel.findOne({ email: userCred.email });
    if (user !== null) {
      bcrypt.compare(userCred.password, user.password, (err, success) => {
        if (success == true) {
          jwt.sign({email:userCred.email},"nutrifyapp",(err,token)=>{
            if(!err){
              res.send({ message: "login success",token:token })
            }
          })


        } else {
          res.status(403).send({ message: "wrong password" });
        }
      });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "problem" });
  }
});

//endpoint to fetch all data

app.get("/foods",verifyToken,async (req,res)=>{

  try{
  let food =await foodModel.find()
  res.send(food)
}
catch(err){
  console.log(err)
  res.status(500).send({message:"data not avilable"})
}
})

//search food by name

app.get("/foods/:name",verifyToken,async (req,res)=>{
  try{
    console.log(req.params)
     let foods = await foodModel.find({food:{$regex:req.params.name,$options:"i"}})
     if(foods.length!==0){
     res.send(foods)
    }
    else{
      res.status(404).send({message:"food item not food"})
    }
}

catch(err){
  console.log(err)
  res.status(500).send({message:"some problem in getting the food"})
}
 
})




//starting the server
app.listen(8000, () => {
  console.log("server started");
});
