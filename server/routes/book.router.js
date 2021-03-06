const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});


/**
 * App Delete
 * Removes individual array items by id
 */
//  app.delete('/result:id', function(req, response) {
//   bundleCalculations.splice(req.params.id, 1);
//   response.send(bundleCalculations);
// });

router.delete('/:id', (req, res) => {
  console.log('params', req.params);
  let sqlQuery = `
    DELETE FROM books WHERE id=$1;
  `;

  let sqlParams = [
    req.params.id, // $1
  ]

  pool.query(sqlQuery, sqlParams)
    .then((dbRes) => {
        res.send(201);
    })
    .catch((err) => {
        console.log("post error", err);
        res.sendStatus(500);
    });
});


router.put('/:id', (req, res) => {
  let isRead = req.body.isread;
  if(isRead === true || isRead === 'true' || isRead === null) {
    isRead = false;
  } else if(isRead === false || isRead === 'false') {
    isRead = true;
  }
  let sqlQuery = `
    UPDATE books SET "isRead" = $1 WHERE id = $2;
  `;

  let sqlParams = [
    isRead,
    req.params.id, // $1
  ]

  console.log('sql params', sqlParams);

  pool.query(sqlQuery, sqlParams)
    .then((dbRes) => {
        res.send(201);
    })
    .catch((err) => {
        console.log("post error", err);
        res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
  console.log('params', req.params);
  let sqlQuery = `
    UPDATE books SET "isRead" ='TRUE' WHERE id = $1;
  `;

  let sqlParams = [
    req.params.id, // $1
  ]

  pool.query(sqlQuery, sqlParams)
    .then((dbRes) => {
        res.send(201);
    })
    .catch((err) => {
        console.log("post error", err);
        res.sendStatus(500);
    });
});




// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status



// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id


module.exports = router;
