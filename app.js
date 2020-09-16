const express = require('express');
const chalk = require('chalk'); // colorize logs for clarity
const debug = require('debug')('app'); // shows debug logs a console does not show
const morgan = require('morgan'); // morgan formats debug logs
const path = require('path'); // path is built in node to clean up file paths
const sql = require('mssql');

const app = express(); // sets up my express app
const port = process.env.PORT || 3000;

const config = {
  user: 'library',
  password: '0bi1TR8_r',
  server: 'pslibraryspencer.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch((err) => debug(err));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public'))); // static setups directory for static files 'css and js' - this allows these files to be accessible to the outside world
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views'); // where to find view engine templates
app.set('view engine', 'ejs'); // sets view engine as pug and where to find templates

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter); // sets base route as /books and passes bookRouter
app.get('/', (req, res) => {
  // dirname is the location of the file that is executed - in this case app.js
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));

  // render a view called index
  // since views are defined above in app.set, it knows where to find the file index
  res.render(
    'index',
    {
      nav: [
        { link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }
      ],
      title: 'Library'
    }
  );
});

// sets a port for express to listen on
app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
