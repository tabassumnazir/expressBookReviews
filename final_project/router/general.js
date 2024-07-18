const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if both the username and password is provided
  if (username && password) {
    //check if user doesnt already exist
    if(!doesExist(username)) {
      //add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. You may now login"})
    } else {
      return res.status(404).json({message:"User already exists!"})
    }
  }
  //return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  for (const key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "Books by this author not found"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  for (const key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "Books with this title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
