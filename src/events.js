const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // API
  router.get('/event', function (req, res, next) {
    db.query(
      `SELECT sala,tblExamen.nume,tblProfesori.nume,tblProfesori.prenume,dataExamen,ora 
      FROM tblGED, tblExPr, tblProfesori, tblExamen WHERE tblGED.idExamen = tblExPr.idExamen 
      AND tblExPr.idProfesori=tblProfesori.idProfesori AND tblExPr.idExamen=tblExamen.idExamen;`,
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