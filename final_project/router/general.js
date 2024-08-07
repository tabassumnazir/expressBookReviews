// const express = require('express');
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();

// const doesExist = (username) => {
//   return users.some(user => user.username === username);
// };

// public_users.post("/register", (req,res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (!username || !password) {
//     return res.status(400).json({message: "Username and password are required."});
//   }

//   if (!isValid(username)) {
//     return res.status(400).json({message: "Username is invalid"});
//   }

//   if (doesExist(username)) {
//     return res.status(409).json({message: "Username already exists"})
//   }
//   users.push({username, password});
//   return res.status(201).json({message: "User is successfully registered"});
// });

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).json(books);  
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({message: "Book not found."});
//   }
//  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const booksByAuthor = [];
//   for (const key in books) {
//     if (books[key].author === author) {
//       booksByAuthor.push(books[key]);
//     }
//   }
//   if (booksByAuthor.length > 0) {
//     return res.status(200).json(booksByAuthor);
//   } else {
//     return res.status(404).json({message: "Books by this author not found"})
//   }
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const booksByTitle = [];
//   for (const key in books) {
//     if (books[key].title === title) {
//       booksByTitle.push(books[key]);
//     }
//   }
//   if (booksByTitle.length > 0) {
//     return res.status(200).json(booksByTitle);
//   } else {
//     return res.status(404).json({message: "Books with this title not found"});
//   }
// });

// //  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book.reviews);
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
// });

// module.exports.general = public_users;


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some(user => user.username === username);
};

public_users.post("/register", (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required."});
  }

  if (!isValid(username)) {
    return res.status(400).json({message: "Username is invalid"});
  }

  if (doesExist(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username, password});
  return res.status(201).json({message: "User successfully registered"});
});

public_users.get('/', function (req, res) {
  Promise.resolve(books)
    .then(bookList => res.status(200).json(bookList))
    .catch(error => res.status(500).json({message: "Error fetching book list", error}));
});

public_users.get('/isbn/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  Promise.resolve(books[isbn])
    .then(book => {%
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({message: "Book not found."});
      }
    })
    .catch(error => res.status(500).json({message: "Error fetching book details", error}));
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  Promise.resolve(booksByAuthor)
    .then(authorBooks => {
      if (authorBooks.length > 0) {
        res.status(200).json(authorBooks);
      } else {
        res.status(404).json({message: "Books by this author not found."});
      }
    })
    .catch(error => res.status(500).json({message: "Error fetching books by author", error}));
});

public_users.get('/title/:title', function (req, res){
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  Promise.resolve(booksByTitle)
    .then(titleBooks => {
      if (titleBooks.length > 0) {
        res.status(200).json(titleBooks);
      }
    })
    .catch(error => res.status(500).json({message: "Error fetching books by title", error}));
});

public_users.get('/review/:isbn', function (req, res){
  const isbn = req.params.isbn;
  Promise.resolve(books[isbn])
    .then(book => {
      if (book) {
        res.status(200).json(book.reviews);
      } else {
        res.status(404).json({message: "Book not found"});
      }
    })
    .catch (error => res.status(500).json({message: "Error fetching book reviews", error}));
});

module.exports.general = public_users;