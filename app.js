const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const data = require('./views/js/getData.js')

const port = '8380'
const messagePort = 'Server started on  http://localhost:' + port + '/index.html'

var app = express()

const pathClient = 'views/'

// Viwe wngine for 'busqueda file'

app.set('view engine', 'ejs')
app.set(pathClient, path.join(__dirname, pathClient))


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}))

// sete satatic path



app.use(express.static(path.join(__dirname, pathClient))) // para crear el cliente



// Create connection

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'inmobiliaria'
})

// Connect
db.connect(function(err){
  if(err){
    throw err;
  }
  console.log('MySQL Connected')
})

  /*----------------------------------*/
 /*  Queries to filter information   */
/*----------------------------------*/


const atributosBienraiz = ['casas', 'departamentos', 'bodegas', 'oficinas', 'terrenos']
const tiposBienraiz = ['casa', 'departamento', 'bodega', 'oficina', 'terreno']

let queryBienRaiz = []

for (let i in tiposBienraiz){
  queryBienRaiz[i] = `
  SELECT id_${tiposBienraiz[i]}
  FROM ${atributosBienraiz[i]}
  `
}

let resultsTipobienraiz = []


for (let i in queryBienRaiz){
  db.query(queryBienRaiz[i], function(err, result) {
    if (err)
      throw err
    else{
      console.log(result)
    }  
  })
}

app.get('/', function(req, res){  
  res.render('index')
})

app.get('/quienes', function(req, res){  
  res.render('quienes')
})

app.get('/servicios', function(req, res){  
  res.render('servicios')
})

app.get('/busqueda', function(req, res){  
  res.render('busqueda')
})

app.get('/contacto', function(req, res){  
  res.render('contacto')
})

/*
app.get('/busqueda.ejs', function (req, res) {
  res.render('busqueda')
})
*/
app.listen(port, function(){
  console.log(messagePort)
})