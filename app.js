const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')

const port = '8380'
const messagePort = 'Server started on  http://localhost:' + port + '/index'

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
  password: '',
  database: 'inmobiliaria'
})

// Connect
db.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected')
})


app.get('/index', function (req, res) {
  res.render('index')
})

app.get('/quienes', function (req, res) {
  res.render('quienes')
})

app.get('/servicios', function (req, res) {
  res.render('servicios')
})

app.get('/busqueda', function (req, res) {
  res.render('busqueda')
})

app.get('/contacto', function (req, res) {
  res.render('contacto')
})

app.post('/busqueda', function (req, res) {
  const bien = req.body.combo
  let tipoBien = []

  switch (bien) {
    case 'div1': tipoBien.push('oficina')
      break

    case 'div2': tipoBien.push('casa')
      break

    case 'div3': tipoBien.push('departamento')
      break

    case 'div4': tipoBien.push('bodega')
      break

    case 'div5': tipoBien.push('terreno')
      break
  }

  const status = req.body.Status
  tipoBien.push(status)

  console.log(tipoBien)

    /*----------------------------------*/
   /*  Queries to filter information   */
  /*----------------------------------*/

  queryBienRaiz = `
  SELECT DISTINCT
    ${tipoBien[0]}s.id_${tipoBien[0]}
  FROM 
    ${tipoBien[0]}s
  `

  db.query(queryBienRaiz, function (err, result) {
    if (err)
      throw err
    else {
      console.log(result)
    }
  })
})

app.post('/contacto', function(req, res){
  const nombre = req.body.Nombre
  const aPaterno = req.body.paterno
  const aMaterno = req.body.materno
  const telefono = req.body.Telefono
  const correo = req.body.Correo

  let queryInsersion = `
  INSERT INTO cliente (nombre_cliente, apellido_pat_cliente, apellido_mat_cliente, telefono, correo) VALUES
  ('${nombre}', '${aPaterno}', '${aMaterno}', '${telefono}', '${correo}');
  `
 
  db.query(queryInsersion, function (err, result) {
    if (err)
      throw err
    else {
      console.log('One record inserted')
    }
  })

})

app.get('/galeria', function (req, res) {
  res.render('galeria')
})

app.listen(port, function () {
  console.log(messagePort)
})