//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cocktailDB", {useNewUrlParser: true});
const cocktailSchema = {
  title: String,
  content: String
};
///// Request targeting all cocktails/////
const Cocktail = mongoose.model("Cocktail", cocktailSchema);
app.route("/cocktails")
  .get(function(req, res){
    Cocktail.find(function(err, foundCocktails){
    if(!err){
      res.send(foundCocktails);
    }
    else {
      res.send(err);
    }
  });
})
  .post(function(req, res){
    const newCocktail = new Cocktail({
    title: req.body.title,
    content:req.body.content
  });

  newCocktail.save(function(err){
    if(!err){
      res.send("Success!");
    }
    else {
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Cocktail.deleteMany(function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  });
});
///// Request targeting specific articles/////
app.route("/cocktails/:cocktailTitle")
  .get(function(req,res){
    Cocktail.findOne({title: req.params.cocktailTitle}, function(err, foundCocktails){
      if(foundCocktails){
        res.send(foundCocktails);
      }else {
        res.send("none");
      }
    });
  })
  .put(function(req,res){
    Cocktail.update(
      {title: req.params.cocktailTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Success");
        }
      }
    );
  })
  .patch(function(req,res){
    Cocktail.update(
      {title: req.params.cocktailTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("success");
        }else{
          res.send(err);
        }
      }
    );
  })
  .delete(function(req,res){
    Cocktail.deleteOne({title: req.params.cocktailTitle}, function(err){
      if (!err){
        res.send("success");
      }else{
        res.send(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
