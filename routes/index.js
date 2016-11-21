var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');

var connect = mysql.createPool({
	connectionLimit : 100,
  	connectTimeout  : 50000,
  	host: "localhost",
	user: "root",
	password: "",
	database: "checkintime",
	charset: "utf8_general_ci"
});

var data ="";

 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'บันทึกรายวัน' });
});


router.get('/selectdata', function(req, res){
      connect.getConnection(function(err,connection) {
        connect.query("SELECT * FROM profile",function(err,result){
          data = result;
          res.json(data);
      });
  });
});


router.post('/insertTime', function(req,res){
  var datetime = moment(req.body.date+' '+req.body.time, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
  var date = moment(datetime, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
  var then = datetime;
  var datenow = moment().format('DD/MM/YYYY');
  var now = moment(datenow+' '+'10:00:00','DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'); 
  if (then > now ) {
    var timelate = moment.duration(moment.utc(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")).asMinutes()
  }else{
    var timelate = "";
  }
  var insert = { 
    time: date, 
    profile_id: req.body.name,
    timelate : timelate
  };
  var update = [req.body.time, req.body.name];
  var from = moment(datetime, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
  connect.query("SELECT * FROM dataday where profile_id='"+req.body.name+"' AND time LIKE '"+from+"%'",function(err,result){
    if (result=='') {
      connect.query('INSERT INTO dataday SET ?', insert, function(err,resinsert){
        res.send('OK');
      });
    }else{
      connect.query("UPDATE dataday SET timeout = ? where profile_id = ? AND time LIKE '"+from+"%'", update, function(err,resinsert){
        res.send('UPDATE');
      });
    }
  });
});


router.get('/getdata', function(req, res){
      connect.getConnection(function(err,connection) {
        var table ="";
        connect.query("SELECT * FROM dataday JOIN profile ON id = dataday.profile_id ORDER BY id_dataDAY DESC",function(err,result){
            result.forEach(function(v,i,arr){
              var timelate = v.timelate == 0? '<td class="text-center"><span>'+v.timelate+' นาที</span></td>':'<td class="text-center"><span style="color:red;">'+v.timelate+' นาที</span></td>';
              table += '<tr>';
              table += '<th class="text-center">'+(i+1)+'</th>'
              table += '<td class="text-center">'+v.name+' '+v.surname+'</td>'
              table += '<td class="text-center">'+moment(v.time).format('DD-MM-YYYY')+'</td>'
              table += '<td class="text-center">'+moment(v.time).format('HH:mm:ss')+'</td>'
              table += timelate;
              table += '<td class="text-center">'+v.timeout+'</td>'
              table += '<td class="text-center">'+v.timelate*5+' บาท</td>'
              table += '</tr>';
            });
          res.send(table);
      });
  });
});


router.get('/search', function(req, res){
  if(req.query.date != '' && req.query.dataEnd != ''){
    var dateNow = moment(req.query.date, 'DD-MM-YYYY').format('YYYY-MM-DD')+ ' 00:00:00';
    var dateLast = moment(req.query.dateEnd, 'DD-MM-YYYY').format('YYYY-MM-DD')+ ' 23:59:59';
        connect.getConnection(function(err,connection) {
          var table ="";
          // connect.query("SELECT * FROM dataday JOIN profile ON id = dataday.profile_id where time LIKE '"+dateNow+"%' ORDER BY id_dataDAY DESC",function(err,result){
          connect.query("SELECT * FROM dataday JOIN profile ON id = dataday.profile_id where time between '"+dateNow+"%' AND '"+dateLast+"' ORDER BY id_dataDAY DESC",function(err,result){
            result.forEach(function(v,i,arr){
              var timelate = v.timelate == 0? '<td class="text-center"><span>'+v.timelate+' นาที</span></td>':'<td class="text-center"><span style="color:red;">'+v.timelate+' นาที</span></td>';
              table += '<tr>';
              table += '<th class="text-center">'+(i+1)+'</th>'
              table += '<td class="text-center">'+v.name+' '+v.surname+'</td>'
              table += '<td class="text-center">'+moment(v.time).format('DD-MM-YYYY')+'</td>'
              table += '<td class="text-center">'+moment(v.time).format('HH:mm:ss')+'</td>'
              table += timelate;
              table += '<td class="text-center">'+v.timeout+'</td>'
              table += '<td class="text-center">'+v.timelate*5+' บาท</td>'
              table += '</tr>';
            });
          res.send(table);
      });
  });
  }else{
    connect.getConnection(function(err,connection) {
      var table ="";
        connect.query("SELECT * FROM dataday JOIN profile ON id = dataday.profile_id ORDER BY id_dataDAY DESC",function(err,result){
          result.forEach(function(v,i,arr){
            var timelate = v.timelate == 0? '<td class="text-center"><span>'+v.timelate+' นาที</span></td>':'<td class="text-center"><span style="color:red;">'+v.timelate+' นาที</span></td>';
            table += '<tr>';
            table += '<th class="text-center">'+(i+1)+'</th>'
            table += '<td class="text-center">'+v.name+' '+v.surname+'</td>'
            table += '<td class="text-center">'+moment(v.time).format('DD-MM-YYYY')+'</td>'
            table += '<td class="text-center">'+moment(v.time).format('HH:mm:ss')+'</td>'
            table += timelate;
            table += '<td class="text-center">'+v.timeout+'</td>'
            table += '<td class="text-center">'+v.timelate*5+' บาท</td>'
            table += '</tr>';
          });
        res.send(table);
      });
    });
  }
});



module.exports = router;


