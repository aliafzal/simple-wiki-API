const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
mongoose.connect("mongodb://localhost:3001/wikiDB",{ useUnifiedTopology: true ,useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("article",articleSchema);

////////////////////////////////////// Request targeting all articles \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/articles")

.get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save(function(err){
        if(!err){
            res.send("Successfully added");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all");
        }
        else{
            res.send(err);
        }
    });
});


////////////////////////////////////// Request targeting specific article \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        }
        else{
            res.send("No article matching this title found");
        }
    });
})

.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
            else{
                res.send(err);
            }
        })
})

.patch(function(req,res){
    
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
            else{
                res.send(err);
            }
        })
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
        if(!err){
            res.send("Successfully deleted");
        }
        else{
            res.send(err);
        }
    });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
