const express = require('express');

const port = 8001;

const app = express();

const fs = require('fs');

const path = require('path')

// const db = require('./config/mongoose')

const mongoose = require('mongoose')

mongoose
    .connect("mongodb+srv://khushikathiriyak:khushi777@cluster0.noxxovd.mongodb.net/khushi", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    })
    .then(() => console.log('Database connected.'))
    .catch(err => console.log(err));

const student = require('./models/student'); 

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded());

// images view...

app.use ('/uploads',express.static(path.join(__dirname,'uploads')))

app.get('/',(req,res)=>{
    return res.render('student_detalis')
})

// ejs page module data insert

app.post('/Addstudentdetalis',student.uploadedImage,async (req,res)=>{

    var imagesPath = '';
    if(req.file){
        imagesPath = student.imageModelPath+'/'+req.file.filename
    }

    req.body.adminImages = imagesPath;
    await student.create(req.body);
    return res.redirect('back')
  
})

//module data view

app.get('/viewdetalis',async (req,res)=>{
    let data = await student.find({});
    console.log(data);
    return res.render('view_detalis',{
        stdata : data 
    })
})


// delete data - view_detalis

app.get('/deleterecord/:id',async(req,res)=>{
    // console.log(req.params.id)

    // images delete...
    let oldData = await student.findById(req.params.id);
    if(oldData.adminImages){
        let fullPath = path.join(__dirname,oldData.adminImages);
        // console.log(fullPath)
        await fs.unlinkSync(fullPath);

    }

    await student.findByIdAndDelete(req.params.id);
    return res.redirect('back')

})


//update data - view_detalis

app.get('/updaterecord/:id',async(req,res)=>{
    // console.log(req.params.id)
    let record = await student.findById(req.params.id);
    // console.log(record);
    return res.render('update',{
        oldst : record
    })
})

// return view page

app.post('/Editstudent',student.uploadedImage,async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);

    let oldRecord = await student.findById(req.body.EditId);
    if(req.file)
    {
     // process old image delete from folder upload... 

        if(oldRecord.adminImages){
            let fullPath = path.join(__dirname,oldRecord.adminImages);
            await fs.unlinkSync(fullPath);
        }

     // set new image name in database mongoDb...
     
        var imagesPath = '';
        imagesPath = student.imageModelPath+'/'+req.file.filename;
        req.body.adminImages = imagesPath;
    }
    else
    {
        // data Updata without images...  
        req.body.adminImages = oldRecord.adminImages
    }
    // edit record with new images...    

       await student.findByIdAndUpdate(req.body.EditId,req.body);
       return res.redirect('/viewdetalis');
})

app.listen(port,(err)=>{
    if(err)
    console.log(err);
    console.log(`srever runing on this is port,${port}`)
})