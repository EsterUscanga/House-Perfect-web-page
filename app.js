const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const data = require('./views/startbootstrap-full-slider/js/getData.js')

const port = '8380'
const messagePort = 'Server started on  http://localhost:' + port + '/index.html'

var app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: false
}))

// sete satatic path

const pathClient = 'views/startbootstrap-full-slider/'

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
      setValue(result)
    }  
  })
}


function setValue(value){
  resultsTipobienraiz = value
  getData(resultsTipobienraiz)
  console.log(resultsTipobienraiz)
}

app.get('/', function(req, res){  
  res.send()
})

app.listen(port, function(){
  console.log(messagePort)
})