const mongoose = require("mongoose");
// const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      //   validate(value) {
      //     if (!validator.isEmail(value)) {
      //         throw new Error('email is not true');
      //     }
      // }
      },
      password:{
        type:String,
        require:true
      }
    })
   module.exports=mongoose.model("user",userSchema)