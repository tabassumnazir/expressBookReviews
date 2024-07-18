const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //check if username exists in users array
  let userExists = users.some((user) => user.username === username);
  //return true if the username doesnt exist (is valid), otherwise false
  return !userExists; 
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //filter the users array for any user with the same username
  let validUsers = users.filter((user) => {
    return (user.username === username  && user.password === password);
  });
  //return true if any valid user is found, otherwise false
  if (validUsers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  //authenticate the user
  if (authenticatedUser(username, password)) {
    //generate JWT access token
    let accessToken = jwt.sign({
      data:password
    }, 'access', {expiresIn: 60*60});
    //store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.body.username;
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if(!review) {
    return res.status(400).json({message: "Review content is missing"})
  }

  //add review or update existing review
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "review successfully added", reviews: books[isbn].review});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  let book = books[isbn];
  if (book) {
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({message: "review deleted successfully", book});
    } else {
      return res.status(404).json({message: "review not found for this user"});
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
