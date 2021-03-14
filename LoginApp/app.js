var express = require('express')
const app = express()

const User  = require('./User.js')
const Task  = require('./Task.js')
const ObjectID = require('mongodb').ObjectID;
var alert = require('alert'); 
const { concatSeries } = require('async');
app.set('view-engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: false}))

var logged_in_user = "";

  
// Routes

app.get('/', function(req,res){
    res.render('index.ejs')
})
///////////////
app.get('/managerLogin', function(req,res){
    res.render('managerLogin.ejs')
})
app.post('/managerLogin', async function(req,res){
   
    var email = req.body.email
    var password = req.body.password

    User.findOne({email: email, password: password}, function(err, user){
        if(err)
        {
            console.log(err)
            return res.status(500).send()
        }
        if(!user)
        {
            return res.status(404).send()
        }
        console.log("Logged in!")
        logged_in_user = email
        res.redirect('/addTask')
    })
        
 })
///////////////
app.get('/workerLogin', function(req,res){
    res.render('workerLogin.ejs')
})
app.post('/workerLogin', function(req,res){
    var email = req.body.email
    var password = req.body.password
 
    User.findOne({email: email, password: password}, function(err, user){
        if(err)
        {
            console.log(err)
            return res.status(500).send()
        }
        if(!user)
        {
            return res.status(404).send()
        }
        console.log("Logged in!")
        logged_in_user = email
        res.redirect('/getTask')
    })
 })
/////////////
app.get('/register', function(req,res){
    res.render('register.ejs')
})

app.post('/register', function(req,res){
   var email = req.body.email
   var password = req.body.password
   var credentials = {'email': req.body.email, 'password': req.body.password };

   // Check if the username already exists for non-social account
   User.findOne({email: req.body.email}, function(err, user){
    if(err) throw err;
    if(user){
      console.log("already exists")
      alert("User already exits.")
      res.redirect('/register');
    }else{
      User.create(credentials, function(err, newUser){
        if(err) throw err;
        console.log("Registered successfully!")
        alert("Registered successfully!")
        res.redirect('/');
      });
    }
  });

})
/////////////
app.get('/addTask', async function(req,res){
    
    try {
        
        var res1 = [], res2 = [], res3= [];

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost/test";

        MongoClient.connect(url, function (err, db) {
            if (err)
                throw err;
            var dbo = db.db("test");
            var query1 = {owner: logged_in_user, submitted: false };
            dbo.collection("tasks").find(query1).toArray(function (err, result1) {
                if (err)
                    throw err;
                res1 = result1;
                console.log("ye dekho " + res1)
                console.log(result1);
            });
            var query2 = { owner: logged_in_user, submitted: true, completed: false };
            dbo.collection("tasks").find(query2).toArray(function (err, result2) {
                if (err)
                    throw err;
                res2 = result2;
                console.log(result2);
            });
            var query3 = { owner: logged_in_user, submitted: true, completed: true };
            dbo.collection("tasks").find(query3).toArray(function (err, result3) {
                if (err)
                    throw err;
                res3 = result3;
                console.log(result3);
            });
            console.log("res1 is " + res1);
            db.close();
            
        }); 
        await new Promise(r => setTimeout(r, 2000));
        res.render('addTask.ejs', { PendingT: res1, AssignedT: res2, DoneT: res3 });
    } 
    catch (e) {
        res.status(500).send(e);
    }  
    
})

app.post('/addTask', async function(req,res){
    var task = req.body.task
    var time = req.body.time
    var newTask = Task()
    newTask.Task = task
    newTask.timeleft = time
    newTask.owner = logged_in_user
    newTask.save(function(err, saveTask){
        if(err)
        {
            console.log(err)
            return res.status(500).send()
        }
        console.log("Task saved successfully!")
        res.redirect('/addTask')
        alert("Task saved successfully")
    })
})
//////////
app.post('/taskUpdate', async function(req,res){
    let temp = req.body.id;
    let t_id = temp.slice(0,-1)
    var uT = req.body.task
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost/test";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("debug 1")
        dbo.collection("tasks").updateOne({_id: new ObjectID(t_id) },{$set :{Task: uT}}, function(err, res) {
            if (err) throw err;
            console.log("Task updated");
            
            db.close();
          });
        alert("Task updated successfully")
    }); 
    res.redirect('/addTask')
})
/////////////
app.get('/getTask', async function(req,res){
    try {
        var res1 = [], res2 = [], res3= [];
        var score = 0

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost/test";

        MongoClient.connect(url, function (err, db) {
            if (err)
                throw err;
            var dbo = db.db("test");
            var query1 = { submitted: false };
            dbo.collection("tasks").find(query1).toArray(function (err, result1) {
                if (err)
                    throw err;
                res1 = result1;

                console.log(result1);
            });
            var query2 = { submitted: true, completed: false };
            dbo.collection("tasks").find(query2).toArray(function (err, result2) {
                if (err)
                    throw err;
                res2 = result2;
                console.log(result2);
            });
            var query3 = { submitted: true, completed: true };
            dbo.collection("tasks").find(query3).toArray(function (err, result3) {
                if (err)
                    throw err;
                res3 = result3;
                console.log(result3);
            });
            var query4 = { email: logged_in_user };
            dbo.collection("myusers").find(query4).toArray(function (err, result4) {
                if (err)
                    throw err;
                score = result4.ponits;
                console.log("score is " + score);
            });

            db.close();
            
        }); 
        await new Promise(r => setTimeout(r, 2000));
        res.render('getTask.ejs', { PendingT: res1, AssignedT: res2, DoneT: res3, point: score });
    } 
    catch (e) {
        res.status(500).send(e);
    }   
})
////////////////
app.post('/taskSubmit', async function(req,res){

    var score = 0
    let temp = req.body.id;
    var res1 = []
    let t_id = temp.slice(0,-1)
    console.log("id type is " + t_id)
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost/test";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        console.log("debug 1")
        dbo.collection("tasks").updateOne({_id: new ObjectID(t_id) },{$set :{submitted: true}}, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            
            db.close();
          });
        console.log("updated!")
        
        dbo.collection("tasks").find().toArray(function(err, result1) {
            if (err) throw err;
            console.log(result1);
            res1 = result1
        });
        var query4 = { email: logged_in_user };
        dbo.collection("myuser").find(query4).toArray(function (err, result2) {
            if (err)
                throw err;
            score = result2.ponits;
            console.log("score is " + score);
        });
        db.close();
        
    }); 
    await new Promise(r => setTimeout(r, 2000));
    res.render('getTask.ejs', { tasksArr: result, point: score })
 })

 //////////////
 app.post('/taskApproval', async function(req,res){

    try {
        
        var res1 = [], res2 = [], res3= [];
        let temp = req.body.id;
        let t_id = temp.slice(0,-1)
        var score = req.body.points
        var oldP = 0
        var subittedby = req.body.submittedBy

        console.log("points are "+score)
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost/test";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("test");
            console.log("debug 1")
            dbo.collection("tasks").updateOne({_id: new ObjectID(t_id) },{$set :{completed: true, points: score}}, function(err, res) {
                if (err) throw err;
                console.log("Task approved");
            });
            var queryTemp = { submittedBy: subittedby };
            dbo.collection("myuser").find(queryTemp).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                oldP = result.points
            });
            dbo.collection("myuser").updateOne({submittedBy:  subittedby},{$set :{ponits: oldP + score}}, function(err, res) {
                if (err) throw err;
                console.log("score updated");
            });
            console.log("updated!")

            var query1 = {owner: logged_in_user, submitted: false };
            dbo.collection("tasks").find(query1).toArray(function (err, result1) {
                if (err)
                    throw err;
                res1 = result1;
                console.log(result1);
            });
            var query2 = { owner: logged_in_user, submitted: true, completed: false };
            dbo.collection("tasks").find(query2).toArray(function (err, result2) {
                if (err)
                    throw err;
                res2 = result2;
                console.log(result2);
            });
            var query3 = { owner: logged_in_user,submitted: true, completed: true };
            dbo.collection("tasks").find(query3).toArray(function (err, result3) {
                if (err)
                    throw err;
                res3 = result3;
                console.log(result3);
            });
            db.close();

        }); 
        await new Promise(r => setTimeout(r, 2000));
        res.render('addTask.ejs', { PendingT: res1, AssignedT: res2, DoneT: res3, point: score });
    } catch (e) {
        res.status(500).send(e);
    }    
 })
app.listen(9000)


