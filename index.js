const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Ask = require("./database/Ask");
const Response = require("./database/Response");

connection.authenticate().then(()=>{
    console.log("connected to database!");
}).catch((msgErro)=>{
    console.log(msgErro);
})

app.set("view engine","ejs");
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.get("/",(req,res)=>{
    Ask.findAll({raw:true, order:[
        ["id","DESC"]
    ]}).then((ask)=>{
        res.render("index",{
            ask:ask
        });
    })
});
app.get("/ask",(req,res)=>{
    res.render("ask");
});
app.post("/sendquestion",(req,res)=>{
    var title = req.body.title;
    var question = req.body.question;
    Ask.create({
        title: title,
        question: question
    }).then(()=>{
        res.redirect("/");
    });
});

app.get("/askpage/:id",(req,res)=>{
    var id = req.params.id;
    Ask.findOne({
        where: {id:id}
    }).then((ask) => {
        if(ask != undefined){
            Response.findAll({
                where: {askId:ask.id},
                order: [
                    ["id","DESC"]
                ]
            }).then(response => {
                res.render("askpage", {
                    ask:ask,
                    response: response
                });
                
            })
        }else{
            res.redirect("/");
        }
    })
})

app.post("/response/:id", (req,res) => {
    var body = req.body.body;
    var id = req.params.id
    Response.create({
        body:body,
        askId: id
    }).then(() => {
        res.redirect("/askpage/" + id);
    })
    
        
})

app.listen(8080, ()=>{console.log("App Running...")});