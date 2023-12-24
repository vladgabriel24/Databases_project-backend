const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // API
  router.get('/event', function (req, res, next) {
    db.query(
      'SELECT * FROM tblSerie',
      [owner, 10*(req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;