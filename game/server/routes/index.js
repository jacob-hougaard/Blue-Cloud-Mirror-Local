var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=300')
  res.sendFile('index.html', {
    root: './public'
  })
});

module.exports = router;
