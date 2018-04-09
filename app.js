const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const parseInt = require('parse-int')

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
      res.render('/busqueda')
    }
  })


})

app.post('/contacto', function (req, res) {
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
      console.log('One record inserted(en clientes)')
    }
  })

})

app.get('/galeria', function (req, res) {
  res.render('galeria')
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.post('/login', function (req, res) {
  const username = req.body.Username
  const password = req.body.Password

  queryValidacion = `
  SELECT 
    nombre_usuario,
    contrasena
  FROM usuarios
  `
  db.query(queryValidacion, function (err, result) {
    if (err)
      throw err
    else {
      if (username == result[0]['nombre_usuario'] && password == result[0].contrasena) {
        res.render('opcionABC')
      }
    }
  })

})

app.post('/opcionABC', function (req, res) {
  const ABC = req.body.select
  console.log(ABC)
  res.render(ABC)

})

app.post('/altas', function (req, res) {

  let array = []

  const bien = req.body.select
  array.push(bien)
  const ubicacion = req.body.Ubicacion
  array.push(ubicacion)
  const precio = req.body.Precio
  array.push(precio)
  const superficie = req.body.Superficie
  array.push(superficie)
  const construccion = req.body.Construccion
  array.push(construccion)
  const caracteristicas = req.body.Caracteristicas
  array.push(caracteristicas)
  const status = req.body.Status
  array.push(status)


  switch (bien) {
    case 'div1':
      const noBanos = req.body.bano
      array.push(noBanos)
      const recepcion = req.body.Recepcion
      array.push(recepcion)
      const estacionamiento = req.body.Estacionamiento
      array.push(estacionamiento)

      console.log(array)

      const queryOficinas = `
    INSERT INTO oficinas (num_bano, recepcion, estacionamiento) VALUES
    ('${noBanos}', '${recepcion}', '${estacionamiento}');
    `
      console.log(queryOficinas)

      db.query(queryOficinas, function (err, result) {
        if (err)
          throw err
        else {
          console.log('One record inserted(En tabla oficinas)')
        }
      })

      //To do: change the next query to a specify instrucion to get the last id 

      let query = `
      SELECT id_oficina FROM oficinas
      WHERE id_oficina =(SELECT MAX(id_oficina) FROM oficinas)
    `

      db.query(query, function (err, result) {
        if (err)
          throw err
        else {

          let id = parseInt(result[0]['id_oficina'])

          const queryOficinas_bienRaiz = `
        INSERT INTO bienes_raices (ubicacion, precio, superficie, contruccion, caracteristicas, status, cod_departamento, cod_bodega, cod_casa, cod_terreno, cod_oficina, cod_compra) VALUES
        ('${ubicacion}', '${precio}', '${superficie}', '${construccion}', '${caracteristicas}', '${status}', 1, 1, 1, 1, ${parseInt(result[0]['id_oficina'])}, 1);
        `
          console.log(queryOficinas_bienRaiz)


          db.query(queryOficinas_bienRaiz, function (err, result) {
            if (err)
              throw err
            else {
              console.log('One record inserted(En tabla bienes_raices)')
            }
          })



        }
      })
      break

    case 'div2':
      const capacidadCochera = req.body.cochera
      console.log(capacidadCochera)
      const numVestidor = req.body.vestidor
      console.log(numVestidor)
      const numRecamaras = req.body.recamara
      console.log(numRecamaras)
      const num = req.body.bano
      const numBano = num[1]
      console.log(numBano)
      const cuartoServicio = req.body.servicio
      console.log(cuartoServicio)
      const numSalastv = req.body.tv
      console.log(numSalastv)
      const jardin = req.body.Jardin
      console.log(jardin)

      const queryCasa = `
      INSERT INTO casas (capacidad_cochera, num_vestidor, num_recamara, num_bano, cuarto_servicio, num_sala_tv, jardin) VALUES
      ('${capacidadCochera}', '${numVestidor}', '${numRecamaras}', '${numBano}', '${cuartoServicio}', '${numSalastv} , '${jardin});
      `
      db.query(queryCasa, function (err, result) {
        if (err)
          throw err
        else {
          console.log('One record inserted(En tabla casas)')
        }
      })

      query = `
      SELECT id_casa FROM casas
      WHERE id_casa =(SELECT MAX(id_casa) FROM casas)
      `

      db.query(query, function (err, result) {
        if (err)
          throw err
        else {

          let id = parseInt(result[0]['id_casa'])

          const querycasas_bienRaiz = `
          INSERT INTO bienes_raices (ubicacion, precio, superficie, contruccion, caracteristicas, status, cod_departamento, cod_bodega, cod_casa, cod_terreno, cod_casas, cod_compra) VALUES
          ('${ubicacion}', '${precio}', '${superficie}', '${construccion}', '${caracteristicas}', '${status}', 1, 1, 1, 1, ${parseInt(result[0]['id_oficina'])}, 1);
          `
          console.log(queryOficinas_bienRaiz)


          db.query(queryOficinas_bienRaiz, function (err, result) {
            if (err)
              throw err
            else {
              console.log('One record inserted(En tabla bienes_raices)')
            }
          })
        }
      })

      break

    case 'div3':

      break

    case 'div4':

      break

    case 'div5':

      break
  }


})


app.listen(port, function () {
  console.log(messagePort)
})