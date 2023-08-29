require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8081;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)





// const startServer = async (app) =>{

//     try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected!`)
//     await app.listen(PORT,(err)=>{
//         if(err) console.log(err);
//         console.log(`Server is listening on PORT: ${PORT}`);
//     })  
//     } catch (error) {
//         console.log(error);
//     }
   
// }



app.get('/',(req, res)=>{
    res.send("<h1>This is / route</h1>");
})

app.listen(PORT,(err)=>{
    if(err) console.log(err);
    console.log(`Server is listening on PORT: ${PORT}`);
})


// startServer(app);
app.listen(PORT, ()=>{
console.log(`Server is listening on PORT: ${PORT}`);
})