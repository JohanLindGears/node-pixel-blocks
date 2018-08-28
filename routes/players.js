const express = require('express');
const pool = require('../db');
const router = express.Router();
const { today, yesterday } = require('../lib/date');

//
router.get('/', (req, res) => {
  pool.query("SELECT *,  (SELECT COUNT(DISTINCT(level_title)) FROM progress WHERE progress.player_id=players.id) AS levels_completed FROM players WHERE highscore > 0 ORDER BY highscore DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Todays best
router.post('/update', (req, res) => {
  var sql = `UPDATE players SET highscore=${req.body.score}, updated=${today} WHERE id=${req.body.id}`;

  pool.query(sql, function(err, result, fields) {
    if (err)
      throw err;
    }
  );
});

//Todays best
router.post('/create', (req, res) => {
  var values = [
    [req.body.username]
  ];
  pool.query("SELECT username FROM players WHERE username=?", [values], function(err, result, fields) {

    if (result.length > 0) {
      res.send('taken');
    } else {

      var sql = "INSERT INTO players (username, joined) VALUES ?";
      var values = [
        [req.body.username, today]
      ];
      pool.query(sql, [values], function(err, result, fields) {
        if (err)
          throw err;
        res.send('' + result.insertId);
      });
    }
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM players WHERE id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;
