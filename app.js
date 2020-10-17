/*
 * */
require('dotenv').config();

/** Framework for backend webapp server for nodejs
installed by 
installation
1- mkdir Secrets
2- cd Secrets
3- npm init
3- npm install express --save or --no-save 
   yarn add --dev
   API  const express= require("express");
**/
const express = require("express");

/*
Body-parser is the Node. js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it

 npm install body-parser
 *Api const bodyParser = require("body-parser");
 */
const bodyParser = require("body-parser");


const mongoose = require("mongoose");

/*
 * Embedded Javascript Templating
 * EJS is a simple templating language that lets
 * you generate HTML markup with plain JavaScripti
*/
const ejs = require("ejs");


/*
 *
 * */
const encrypt =require("mongoose-encryption");




const app = express();


/*To serve static files such as images, CSS files
 * , and JavaScript files, use the express.
 * static builti-in middleware function in Express.
 *
 * Now, you can load the files that are in the
 * public directory:
 * http://localhost:3000/images/kitten.jpg
 *
 * app.use('/static', express.static('public'))
 * http://localhost:3000/static/images/kitten.jpg
 *
 * app.use('/static', express.static
 * (path.join(__dirname, 'public')))
 * */
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});


/*
 *
 * */
const userSchema= new mongoose.Schema({
	email:String,
	password:String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User=new mongoose.model("User",userSchema);




app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){               res.render("register");
});


/*
 *
 * */
app.post("/register", function(req, res){   

const newUser = new User({
	email: req.body.username,
	password: req.body.password
});
newUser.save(function(err) {
if (err) {
	console.log(err);
} else { res.render("secrets");
}
})
});

/*
 *
 * */
app.post("/login",function(req,res){
const username= req.body.username;
const password= req.body.password;

User.findOne({email: username}, function(err, foundUser) {
if (err) {
	console.log(err);
}
else {
if (foundUser){
if (foundUser.password===password) {
	res.render("secrets");
}
}
}
});

});



/*
 *
 *
 * */
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});

