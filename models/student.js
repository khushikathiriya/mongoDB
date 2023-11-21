const mongoose = require('mongoose');

const multer = require('multer');

const imagepath = '/uploads';

const path = require('path')

const studentSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    hobby : {
        type : Array,
        required : true,
    },
    city : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        required : true,
    },
    adminImages : {
        type : String,
        required : true,
    }
})


const storageIamge = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'..',imagepath))
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now())
    }
})
studentSchema.statics.uploadedImage = multer({storage : storageIamge}).single('adminImages');

// image path...

studentSchema.statics.imageModelPath = imagepath;

const student = mongoose.model('student',studentSchema);

module.exports = student;