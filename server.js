const express = require('express');
const app = express();

const jwt=require('jsonwebtoken');
const bodyParser=require('body-parser');

const exjwt=require('express-jwt');

const path=require('path');
var history="";

const secretKey="My super secret key";

const jwtMW=exjwt({
    secret:secretKey,
    algorithms:['HS256']
})

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','https://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const PORT = 3000;

let users=[{
    id: 1,
    username:'somesh',
    password:'123'
    },
    {
    id: 2,
    username:'kale',
    password:'1234'
    }
];

app.post('/api/login',(req,res)=>{
    const {username, password}=req.body;

    for(let user of users){
        if(username == user.username && password == user.password){
            let token =jwt.sign({id:user.id, username:user.username}, secretKey,{expiresIn:'180000'});
                res.json({
                    success:true,
                    err: null,
                    token
                });
                break;
            }
            else{
                res.status(401).json({
                    success:false,
                    token:null,
                    err:"username or password is incorrect"
                });
            }
    }
});

app.get('/api/dashboard',jwtMW,(req,res)=>{
    
    res.json({
        success:true,
        myContent: 'visible to logged in people'
    });
});

app.get('/api/settings',jwtMW,(req,res)=>{
    
    res.json({
        success:true,
        myContent1: 'settings visible to logged in people'
    });
});
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

app.use(function(err,req,res,next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json({
            success:false,
            officialError:err,
            err:'Username / password is incorrect 2'
        });
    }
    else{
        next(err);
    }
});

app.listen(PORT,()=>{
    console.log('Serving on port'+ PORT);
})