var express= require('express');
var bodyParser = require('body-parser');
var mysql= require('mysql');
var path = require('path');
const multer = require('multer');
const { log } = require('console');
const { link } = require('fs');


var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'book'
})

con.connect();

var app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/image')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  var upload = multer({ storage: storage })





app.get('/register',function(req,res){
    res.render('register');
})

app.post('/register',function(req,res){
    let name=req.body.name
    let email=req.body.email
    let password=req.body.password
    let phone_no = req.body.phone_no

    var query = "insert into user(name,email,password,phone_no)values('"+name+"','"+email+"','"+password+"','"+phone_no+"') ";
    con.query(query,function(error,results,field){
        if(error) throw error;
        res.redirect('/');
    })  
})

app.get('/',function(req,res){
    res.render('login');
})

app.post('/',function(req,res){
   
    let email=req.body.email
    let password=req.body.password
    var query = "select * from user where  email='"+email+"' and password='"+password+"'";
    con.query(query, async function(error,results,field){

        if(error) throw error
        if(results.length!=0)
        {
            res.redirect('/user_dashboard');
        }
        else{
            res.redirect('nd')
        }
        
    })  
})

app.get('/user_dashboard',function(req,res){

    var query = "select * from book";

    con.query(query,function(error,results,field){
        if(error) throw error
        res.render('user_dashboard', { results });
    })
})

app.post('/user_dashboard',function(req,res){

    let name = req.body.name

    var query = "select * from book where title='"+name+"' or author='"+name+"' or genre='"+name+"' ";

    con.query(query,function(error,results,field){
        if(error) throw error
        if(results.length==0)
        {
            var query = "select * from book";

            con.query(query,function(error,results,field){
                if(error) throw error
                res.render('user_dashboard', { results });
            })
        }else
        {
            res.render('user_dashboard', { results });
        }
       
    })
})


//admin side
app.get('/admin',function(req,res){
    res.render('admin');
})

app.post('/admin',function(req,res){
   
    let email=req.body.email
    let password=req.body.password
    var query = "select * from admin where  email='"+email+"' and password='"+password+"'";
    con.query(query, async function(error,results,field){

        if(error) throw error
        if(results.length!=0)
        {
            res.redirect('/admin/admin_dashboard');
        }
        else{
            res.redirect('/admin')
        }
        
    })  
})

app.get('/admin/admin_dashboard',function(req,res){
    var query = "select * from book";

    con.query(query,function(error,results,field){
        if(error) throw error
        res.render('admin_dashboard',{results});
    })

})


app.get('/admin/add_book',function(req,res){
    res.render('add_book');
})


app.post('/admin/add_book',upload.single('image'),function(req,res){
   
    let title=req.body.title
    let author=req.body.author
    let genre=req.body.genre
    let image=req.file.originalname
    
    var query = "insert into book(title,author,genre,image)values('"+title+"','"+author+"','"+genre+"','"+image+"') ";
   console.log(query);
    con.query(query,function(error,results,field){
        if(error) throw error
        if(results.length!=0)
        {
            res.redirect('/admin/admin_dashboard');
        }
        else{
            res.redirect('/admin/add_book')
        }
    })
})


app.get('/admin/update_book/:id',function(req,res){
    res.render('update_book');
})



app.post('/admin/update_book/:id',upload.single('image'),function(req,res){
   
    let id = req.params.id
    let title=req.body.title
    let author=req.body.author
    let genre=req.body.genre
    let image=req.file.originalname

    var query = "UPDATE book SET title='" + title + "', author='" + author + "', genre='" + genre + "', image='" + image + "' WHERE id=" + id;

   console.log(query);
    con.query(query,function(error,results,field){
        if(error) throw error
        if(results.length!=0)
        {
            res.redirect('/admin/admin_dashboard');
        }
        else{
            res.redirect('/admin/update_book/:id')
        }
    })
})



app.get('/admin/delete_book/:id',function(req,res){

    var id = req.params.id;

    var query = "delete from book where id="+id;
    con.query(query,function(error,results,field){
        if(error) throw error;
        res.redirect('/admin/admin_dashboard');
    })
})

app.listen(3000);