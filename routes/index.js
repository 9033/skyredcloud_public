var express = require('express');
var router = express.Router();

var url=require('url');
const qs=require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'skyred.cloud' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

router.get('/busseat', function(req, res, next) {
  const urlp = url.parse(req.url);
  //console.log(urlp);
  const {query}=urlp;
  const qparse=qs.parse(query);
  res.render('busseat', { title: 'busseat',query:qparse });
});

module.exports = router;
