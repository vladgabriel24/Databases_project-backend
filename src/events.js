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

  router.get('/tblDiscipline', function (req, res, next) {
    db.query(
      `SELECT
        nume, 
        puncteCredit 
      FROM 
        tblDiscipline;`,
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

  router.post('/edit-tblGED', function (req, res, next) {

    const {target, modifier} = req.body;

    db.query(
      `UPDATE  
      tblGED
      SET
      tblGED.sala = '${modifier.Sala}',
      tblGED.dataExamen = '${modifier.Data}',
      tblGED.ora = '${modifier.Ora}'
      WHERE 
      tblGED.sala = '${target.Sala}'
      AND
      tblGED.dataExamen = '${target.Data}'
      AND
      tblGED.ora = '${target.Ora}';`,
      [target.Sala, target.Data, target.Ora, modifier.Sala, modifier.Data, modifier.Ora],
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

  router.post('/info-add', function (req, res, next) {

    const {
      An, 
      Disciplina,
      Durata,
      Examen,
      Grupa,
      Prag,
      Punctaj,
      Serie,
      Specializare,
      puncte_credit
    } = req.body;

    console.log(
      `SELECT
      *
      FROM
      (
          (
              SELECT 
              idDiscipline 
              FROM 
              tblDiscipline 
              WHERE 
              nume = '${Disciplina}'
              AND
              puncteCredit = '${puncte_credit}'
          ) as Disciplina,
          (
              SELECT 
              idExamen 
              FROM 
              tblExamen 
              WHERE 
              nume = '${Examen}' 
              AND 
              punctaj='${Punctaj}' 
              AND 
              prag='${Prag}' 
              AND 
              durata='${Durata}'
          ) as Examen,
          (
              SELECT
              idGrupa
              FROM
              tblGrupa
              WHERE
              idSerie = (
                  SELECT
                  idSerie
                  FROM
                  tblSerie
                  WHERE
                  denumireSerie = '${Serie}'
                  AND
                  specializare = '${Specializare}'
                  AND
                  an = '${An}'
              )
              AND
              denumireGrupa = '${Grupa}'
          ) as Grupa
      );`
    );

    db.query(
      `SELECT
      *
      FROM
      (
          (
              SELECT 
              idDiscipline 
              FROM 
              tblDiscipline 
              WHERE 
              nume = '${Disciplina}'
              AND
              puncteCredit = '${puncte_credit}'
          ) as Disciplina,
          (
              SELECT 
              idExamen 
              FROM 
              tblExamen 
              WHERE 
              nume = '${Examen}' 
              AND 
              punctaj='${Punctaj}' 
              AND 
              prag='${Prag}' 
              AND 
              durata='${Durata}'
          ) as Examen,
          (
              SELECT
              idGrupa
              FROM
              tblGrupa
              WHERE
              idSerie = (
                  SELECT
                  idSerie
                  FROM
                  tblSerie
                  WHERE
                  denumireSerie = '${Serie}'
                  AND
                  specializare = '${Specializare}'
                  AND
                  an = '${An}'
              )
              AND
              denumireGrupa = '${Grupa}'
          ) as Grupa
      );`,
      [
        An, 
        Disciplina,
        Durata,
        Examen,
        Grupa,
        Prag,
        Punctaj,
        Serie,
        Specializare,
        puncte_credit
      ],
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

  router.post('/add', function (req, res, next) {

    const {idExamen, idDiscipline, idGrupa, sala, dataExamen, ora} = req.body;

    db.query(
      `INSERT INTO 
        tblGED(idExamen, idDiscipline, idGrupa, sala, dataExamen, ora)
        VALUES
        (${idExamen},${idDiscipline},${idGrupa},'${sala}','${dataExamen}','${ora}');`,
      [],
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

  router.delete('/delete-multiple', function (req, res, next) {

    const {Data, Ora, Sala} = req.body;

    db.query(
      `DELETE FROM
      tblGED
      WHERE
      tblGED.sala IN (?)
      AND
      tblGED.dataExamen IN (?)
      AND
      tblGED.ora IN (?);`,
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

  router.delete('/delete', function (req, res, next) {

    const {Data, Ora, Sala} = req.body;

    db.query(
      `DELETE FROM
      tblGED
      WHERE
      tblGED.sala = ?
      AND
      tblGED.dataExamen = ?
      AND
      tblGED.ora = ?;`,
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