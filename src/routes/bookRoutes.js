const express = require('express');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router(); // router to group similar routes
const sql = require('mssql');

const router = (nav) => {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nik',
      read: false
    },
    {
      title: 'Les Mis',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The Time Machine',
      genre: 'Scienece Fiction',
      author: 'H. G. Wells',
      read: false
    },
    {
      title: 'Harry Potter',
      genre: 'Fantasy',
      author: 'J.K. Rowling',
      read: false
    },
  ];

  bookRouter.route('/') // base route of /books - base route of /books is set in app.js on the app.use()
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        // render (view, data) - render books view, books data
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          }
        );
      }());
    });
  bookRouter.route('/:id') // child route of /books/single
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
      }());
    })
    .get((req, res) => {
      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: req.book
        }
      );
    });

  return bookRouter;
};

module.exports = router;
