const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // API
  router.get('/tblGED', function (req, res, next) {
    db.query(
      `SELECT 
      tblExamen.nume as Examen,
      sala as Sala,
      dataExamen as Data,
      ora as Ora 
      FROM 
      tblGED, tblExamen 
      WHERE 
      tblGED.idExamen = tblExamen.idExamen;`,
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