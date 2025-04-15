const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs" );
app.set('views', path.join(__dirname, 'views'));

let port = 8080;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'mysql_app',
  password: // create your own connection and password
});

app.get("/", (req, res)=>{
  let q = "SELECT COUNT(*) FROM USER";

  try {
     connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["COUNT(*)"];
      res.render("home.ejs", {count});
    });
     } catch (err){
        console.log(err);
        res.send("We have got some error");
     };

})

app.get("/user", (req, res)=>{
 let q = "select * from user";
 try {
  connection.query(q, (err, result) => {
   if (err) throw err;
   let users = result;
   res.render("showUser.ejs", {users})
 });
  } catch (err){
     console.log(err);
     res.send("We have got some error in user route");
  };
})

app.get("/user/:id/edit", (req, res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM USER WHERE id = '${id}'`;
  try {
  connection.query(q, (err, result) => {
    if (err) throw err;
    let users = result[0];
    res.render("edit.ejs", { users });
  }); 

  }  catch (err){
    console.log(err);
  };
});

app.patch("/user/:id", (req, res) =>{
  let {id} = req.params;
  let {password: formpass , username: newusername} = req.body;
  let q = `SELECT * FROM USER WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result[0];
      if(users.password != formpass){
        res.send("Wrong password");
      }
      let q2 = `UPDATE user SET username = '${newusername}'where id = '${id}'`;
      connection.query(q2, (err, result)=>{
        if (err) throw err;
        res.redirect("/user");
      });

    }); 
    }  catch (err){
      console.log(err);
    };
});

app.get("/user/new", (req, res)=>{
  res.render("NewUser.ejs");
});

app.post("/user/post", (req, res)=>{
  let {id , email , username , password} = req.body;
  let q3 = `INSERT INTO USER VALUES("${id}" , "${username}"  , "${email}" , "${password}" ) `;
  try {
  connection.query(q3, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect("/user");
  });
  }  catch (err){
    console.log(err);
  };
})

app.get("/user/:id/Delete", (req, res)=>{
  let {id } = req.params;
  let q4 = `SELECT * FROM user WHERE id='${id}'`;
  try {
  connection.query(q4, (err, result) => {
    if (err) throw err;
    let user = result[0];
    res.render("deleteForm.ejs", {user});
  });
  }  catch (err){
    console.log(err);
  };
})

app.delete("/user/:id/Delete", (req, res)=>{
    let { id } = req.params;
     let {username , password} = req.body;
     let q5 =`SELECT * FROM USER WHERE id = '${id}'`;
     try {
     connection.query(q5, (err, result) => {
     if (err) throw err;
     let user = result[0];
      if(username != user.username && password != user.password){
        res.send("Wrong username or password");
      }
       else{
        let q6 = `DELETE FROM user WHERE id= '${id}'`;
        try {
        connection.query(q6, (err, result) => {
        if (err) throw err;
        res.redirect("/user");
        console.log(result);
         });
         }  catch (err){
        console.log(err);
        };
      }
     });
     }  catch (err){
     console.log(err);
     };
})

app.listen(port, (req, res) => {
  console.log("Server is live at 8080");
});



// 
// try {
  // connection.query(q, [data], (err, result) => {
    // if (err) throw err;
    // console.log(result);
  // });
  // }  catch (err){
    // console.log(err);
  // };
  // 
  // connection.end();