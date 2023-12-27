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

  router.post('/more-info/disciplina', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT 
      tblDiscipline.nume, tblDiscipline.puncteCredit 
      FROM 
      tblGED, tblDiscipline
      WHERE 
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?
      AND
      tblGED.idDiscipline = tblDiscipline.idDiscipline;`,
      [Sala, Data, Ora],
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

  router.post('/more-info/profesor', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT 
      tblProfesori.nume, tblProfesori.prenume, tblProfesori.email
      FROM 
      tblGED, tblExamen, tblExPr, tblProfesori
      WHERE 
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?
      AND
      tblGED.idExamen = tblExamen.idExamen
      AND
      tblExamen.idExamen = tblExPr.idExamen
      AND
      tblExPr.idProfesori = tblProfesori.idProfesori;`,
      [Sala, Data, Ora],
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

  router.post('/more-info/serie', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT 
      tblSerie.denumireSerie, tblSerie.specializare, tblSerie.an
      FROM 
      tblGED, tblGrupa, tblSerie
      WHERE 
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?
      AND
      tblGED.idGrupa = tblGrupa.idGrupa
      AND
      tblGrupa.idSerie = tblSerie.idSerie;`,
      [Sala, Data, Ora],
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

  router.post('/more-info/grupa', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT 
      tblGrupa.denumireGrupa, tblGrupa.numarGrupa
      FROM 
      tblGED, tblGrupa, tblSerie
      WHERE 
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?
      AND
      tblGED.idGrupa = tblGrupa.idGrupa
      AND
      tblGrupa.idSerie = tblSerie.idSerie;`,
      [Sala, Data, Ora],
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

  router.post('/studenti/serie', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT
      tblStudenti.nume, tblStudenti.prenume, tblStudenti.email
      FROM
      tblStudenti
      WHERE
      tblStudenti.idGrupa IN (
          
          SELECT 
          tblGrupa.idGrupa
          FROM 
          tblGrupa
          WHERE 
          tblGrupa.idSerie = (
              SELECT 
              tblSerie.idSerie 
              FROM 
              tblSerie 
              WHERE 
              tblSerie.denumireSerie=(
                  SELECT 
                  tblSerie.denumireSerie
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              ) 
              AND 
              tblSerie.specializare=(
                  SELECT 
                  tblSerie.specializare
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              ) 
              AND 
              tblSerie.an=(
                  SELECT 
                  tblSerie.an
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              )
          )
      );`,
      [Sala, Data, Ora],
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

  router.post('/studenti/grupa-serie', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT
      tblStudenti.nume, tblStudenti.prenume, tblStudenti.email
      FROM
      tblStudenti
      WHERE
      tblStudenti.idGrupa = (
          SELECT 
          tblGrupa.idGrupa
          FROM 
          tblGrupa
          WHERE 
          tblGrupa.denumireGrupa = (
              SELECT 
              tblGrupa.denumireGrupa
              FROM 
              tblGED, tblGrupa, tblSerie
              WHERE 
              tblGED.sala = '${Sala}'
              AND
              tblGED.dataExamen = '${Data}'
              AND
              tblGED.ora = '${Ora}'
              AND
              tblGED.idGrupa = tblGrupa.idGrupa
              AND
              tblGrupa.idSerie = tblSerie.idSerie
          )
          AND
          tblGrupa.idSerie = (
              SELECT 
              tblSerie.idSerie 
              FROM 
              tblSerie 
              WHERE 
              tblSerie.denumireSerie=(
                  SELECT 
                  tblSerie.denumireSerie
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              ) 
              AND 
              tblSerie.specializare=(
                  SELECT 
                  tblSerie.specializare
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              ) 
              AND 
              tblSerie.an=(
                  SELECT 
                  tblSerie.an
                  FROM 
                  tblGED, tblGrupa, tblSerie
                  WHERE 
                  tblGED.sala = '${Sala}'
                  AND
                  tblGED.dataExamen = '${Data}'
                  AND
                  tblGED.ora = '${Ora}'
                  AND
                  tblGED.idGrupa = tblGrupa.idGrupa
                  AND
                  tblGrupa.idSerie = tblSerie.idSerie
              )
          )
      );`,
      [Sala, Data, Ora],
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

  router.post('/more-info/examen', function (req, res, next) {

    const {Examen, Sala, Data, Ora} = req.body;

    db.query(
      `SELECT
      tblExamen.punctaj, tblExamen.prag, tblExamen.durata
      FROM
      tblGED, tblExamen
      WHERE
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?
      AND
      tblGED.idExamen = tblExamen.idExamen;`,
      [Sala, Data, Ora],
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