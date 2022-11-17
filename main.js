const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var sqlite3 = require('sqlite3');

app.use(express.static(__dirname + '/templates'));
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile('./templates/index.html', {root: __dirname})
})

app.post('/addToCart', (req, res) => {
  console.log(req.body);
  let db = new sqlite3.Database("order.db");
  const product = req.body.product;
  const size = req.body.size;
  const price = parseFloat(req.body.price);
  console.log(price)
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS bestellung (product VARCHAR(50), size VARCHAR(2), price DECIMAL(5,2))")
    var stmt = db.prepare("INSERT INTO bestellung (product, size, price) VALUES (?,?,?)");
    stmt.run(product,size,price);
    stmt.finalize();

    db.each("SELECT * FROM bestellung", function(err, row) {
      if (err) throw 'Whoops, got a ' + err;
      console.log(row.product + " " + row.size + " " + row.price);
    });
  });
  db.close();
});

app.get('/sendOrder', (req, res) => {
  let db = new sqlite3.Database("order.db")
  db.serialize(function(){
    db.run("DELETE FROM bestellung;")

    db.each("SELECT * FROM bestellung", function(err, row) {
      if (err) throw 'Whoops, got a ' + err;
      console.log(row.product + " " + row.size + " " + row.price);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

