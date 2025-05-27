import mongoose from "mongoose";

const projectschema=new mongoose.Schema({
    pjt_name:{
        type:String,
        required:[true,"Project name is required"]
    },
    money:{
        type:Number,
        required:[true,"Amount in rupees is required"]
    },
     creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     applied:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }],
     accept:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     completed:{
        type:Boolean,
        default:false
     },
     reviewed:{
      type:Boolean,
      default:false
     },
     accepted:{
        type:Boolean,
        default:false
     },
     bkphoto:{
        type:String,
        default:""
     }, 
     description:{
        type:String
        //This is file to be submitted on cloudinary
        // required:[true,"Description is required"]
     },
     deswritten:{
        type:String,
        maxlength: [1000,"Exceeds the character limit of 1000"],
        required:[true,"Required field"]
     },
     complete_date:{
        type:Date,
        required:[true,"Date field is required"]
     },
     final_date:{
        // Date when user finally submits the project
        type:Date,
        validate: {
      validator: function (value) {
        if (this.completed) {
          return value instanceof Date;
        }
        return true; // if not completed, it's okay to skip
      },
      message: "Final Date is required when task is completed"
    }
     },
     user_review:{
        type:String,
        maxlength:[1000,"User review exceeds max limit of 1000 character"],
        default:""
    },
    rating_user:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
     code_link:{
        type:String
     },
     pdt_link:{
        type:String
     }
},{timestamps:true});

export const project= mongoose.model("project",projectschema);