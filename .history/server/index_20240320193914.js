const express=require('express');
const app=express();
const PORT =4000;
app.use(cors());

//new import
const http=require('http').Server(app);
const cors=require('cors');

app.get('/api',(req,res)=>{
    res.json({
        message:'hello world',
    });
});

http.listen(PORT,()=>{
    console.log('Server listening on ${PORT}');
});
