const express = require('express');
const pool = require('../db');
const router = express.Router();

const todayDate = () => {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  month = month >= 10
    ? month
    : "0" + month;

  var day = dt.getDate();
  day = day >= 10
    ? day
    : "0" + day;
  var date = dt.getFullYear() + "-" + month + "-" + day;
  return date;
};

//Get all events
router.get('/', (req, res) => {
  pool.query("SELECT * FROM events ORDER BY id DESC", function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

//Update progress for player
router.post('/', (req, res) => {
  var sql = "INSERT INTO events (player_id, event_type, event_value, event_date) VALUES ?";
  const date = todayDate();

  var values = [
    [req.body.id, req.body.event_type, req.body.event_value, date]
  ];
  console.log(values);
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting event ' + err);
    res.send('Success inserting event');
  });
});

router.get('/daily/:id', (req, res) => {
  const id = req.params.id;

  const date = todayDate();

  var sql = `SELECT player_id FROM daily WHERE date='${date}' AND player_id=` + req.params.id;
  pool.query(sql, function(err, result, fields) {
    var resp = result.length > 0
      ? 'ALLREADY_LOOTED'
      : 'NO_GAMES';
    res.send(resp);
  });
});

//Update progress for player
router.post('/daily', (req, res) => {
  var sql = "INSERT INTO daily (player_id, rank, date) VALUES ?";

  const date = todayDate();

  var values = [
    [req.body.id, req.body.rank, date]
  ];
  console.log(values);
  pool.query(sql, [values], function(err, result, fields) {
    if (err)
      res.send('Error inserting daily ' + err);
    res.send('Success inserting daily');
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM events WHERE player_id=" + id, function(err, result, fields) {
    if (err)
      throw err;
    res.send(result);
  });
});

module.exports = router;
