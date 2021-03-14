const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
global.authenticate = 0;
global.red = 0;
global.username = "";

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://pj-admin:test123@cluster0.tclkd.mongodb.net/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
const reviewSchema = new mongoose.Schema ({
  email: String,
  name: String,
  rating: Number,
  review: String,
  date:
  {
    type:Date, 
    default:Date.now()
  }
});
const avgSchema = new mongoose.Schema ({
  name: String,
  rating: String,
  tot: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);
const Review = new mongoose.model("Review", reviewSchema);
const Avg = new mongoose.model("Avg", avgSchema);

app.get("/", function(req, res){
  Avg.find(function(err,results){
    if(err)
    {
      console.log(err);
    }
    else
    {
  var mov1 = Math.round(Number(results[0].rating)/Number(results[0].tot));
  if(results[0].tot==0){mov1 = 0};
  console.log(mov1);
  var mov2 = Math.round(Number(results[1].rating)/Number(results[1].tot));
  if(results[1].tot==0){mov2 = 0};
  console.log(mov2);
  var mov3 = Math.round(Number(results[2].rating)/Number(results[2].tot));
  if(results[2].tot==0){mov3 = 0};
  console.log(mov3);
  var mov4 = Math.round(Number(results[3].rating)/Number(results[3].tot));
  if(results[3].tot==0){mov4 = 0};
  console.log(mov4);
  var mov5 = Math.round(Number(results[4].rating)/Number(results[4].tot));
  if(results[4].tot==0){mov5 = 0};
  console.log(mov5);
  var mov6 = Math.round(Number(results[5].rating)/Number(results[5].tot));
  if(results[5].tot==0){mov6 = 0};
  console.log(mov6);
  var mov7 = Math.round(Number(results[6].rating)/Number(results[6].tot));
  if(results[6].tot==0){mov7 = 0};
  console.log(mov7);
  var mov8 = Math.round(Number(results[7].rating)/Number(results[7].tot));
  if(results[7].tot==0){mov8 = 0};
  console.log(mov8);
  var mov9 = Math.round(Number(results[8].rating)/Number(results[8].tot));
  if(results[8].tot==0){mov9 = 0};
  console.log(mov9);
  var mov10 = Math.round(Number(results[9].rating)/Number(results[9].tot));
  if(results[9].tot==0){mov10 = 0};
  console.log(mov10);
  var mov11 = Math.round(Number(results[10].rating)/Number(results[10].tot));
  if(results[10].tot==0){mov11 = 0};
  console.log(mov11);
  var mov12 = Math.round(Number(results[11].rating)/Number(results[11].tot));
  if(results[11].tot==0){mov12 = 0};
  console.log(mov12);
  res.render('index',{mov1:mov1,mov2:mov2,mov3:mov3,mov4:mov4,mov5:mov5,mov6:mov6,mov7:mov7,mov8:mov8,mov9:mov9,mov10:mov10,mov11:mov11,mov12:mov12,authenticate:authenticate});
    }
  });
});
app.get("/login", function(req, res){
  res.sendFile(__dirname+'/login.html');
});
app.get("/register", function(req, res){
  res.sendFile(__dirname+'/register.html');
});
app.get("/review", function(req, res){
  if(authenticate==0)
  {
    red = 1;
    res.redirect('/login');
  }
  else
  {
    res.sendFile(__dirname+'/review.html');
  }
});
app.get('/signout',function(req,res){
  authenticate = 0;
  res.redirect('/');
})
app.get('/:inp',function(req,res){
  var tot_rat = 0;
  var tot_user = 0;
  let param = req.params.inp;
  Review.find({ name: param }, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      Avg.findOne({ name: param }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          tot_rat = result.rating;
          tot_user = result.tot;
          console.log("rating",tot_rat);
      console.log("users",tot_user);
      var avg = Math.round(Number(tot_rat)/Number(tot_user));
      console.log("avg",avg);
      res.render('dummy',{results:results,avgRating:avg});
        }
      });
      
    }
  });

})

app.post("/register", function(req, res){
  username = req.body.username;
  const newUser =  new User({
    email: username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      authenticate=1;
      if(red==1)
      {
        res.redirect('/review');
      }
      else
      {
        res.redirect('/');
      }
    }
  });

});
app.post("/login", function(req, res){
  username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          authenticate=1;
          if(red==1)
          {
            res.redirect('/review');
          }
          else
          {
            res.redirect('/');
          }
        }
      }
    }
  });
});
app.post("/review",function(req,res){
  var org_rating=0;
  var org_tot=0;
  var mov_name = req.body.name;
  var rate = Number(req.body.rate);
  console.log("rating",rate);
  const newReview =  new Review({
    email: username,
    name: mov_name,
    rating: rate,
    review: req.body.review
  });
  Avg.findOne({name:mov_name}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser)
       {
        org_rating = Number(foundUser.rating);
        org_tot = Number(foundUser.tot);
        console.log("rating",org_rating,typeof org_rating);
        console.log("tot",org_tot, typeof org_tot);
        console.log("all good - find")
        
        var new_rating = org_rating+rate;
        var new_tot = org_tot+1;
        console.log("update rat",new_rating);
        console.log("updated tot",new_tot);
        Avg.updateOne({name:mov_name},{rating:new_rating,tot:new_tot},function(err){
      if(err){
           console.log(err);
         }
         else{
           console.log('All good - update')
         }
       })
        newReview.save(function(err){
          if (err)
          {
            console.log(err);
          } 
          else 
          {
            res.redirect('/review');
          }
        });
      }
    }
  });

})
app.listen(3000, function() {
  console.log("Server started on port 3000.");
}); 