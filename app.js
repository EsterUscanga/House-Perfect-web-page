const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const parseInt = require('parse-int')
const fileUpload = require('express-fileupload')

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

app.use(fileUpload())
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


  if (ABC == 'bajas') {
    const queryBajas = `
      SELECT * 
      FROM bienes_raices
    `
    db.query(queryBajas, function (err, result) {
      if (err)
        throw err
      else {
        let toHtml = result
        res.render(ABC, {
          data: toHtml
        })
      }
    })
  }
  if (ABC == 'cambios') {
    const queryCambios = `
     SELECT * 
     FROM casas
    `
    db.query(queryCambios, function (err, result) {
      if (err)
        throw err
      else {
        let toHtml = result
        res.render(ABC, {
          data: toHtml
        })
      }
    })

  }
  if (ABC == 'altas') {
    res.render(ABC)
  }
})


const porEliminar = []

app.post('/bajas', function (req, res) {
  const ID = req.body.id

  const queryCodigos = `
    SELECT  cod_departamento , cod_bodega , cod_casa , cod_terreno , cod_oficina 
    FROM bienes_raices
    WHERE id_bien_raiz = ${ID}


  `
  console.log(queryCodigos)
  let deleteBien
  let queryDelete

  deleteBien = `
  DELETE FROM bienes_raices WHERE bienes_raices.id_bien_raiz = ${ID};
  `
  console.log(deleteBien)




  db.query(queryCodigos, function (err, result) {
    if (err)
      throw err
    else {

      let obj = result
      console.log(obj[0]['cod_departamento'])

      console.log(obj)


      if (obj[0]['cod_departamento'] != 1) {

        queryDelete = `
          DELETE FROM departamentos WHERE departamentos.id_departamento = ${obj[0]['cod_departamento']};
        `
      }

      if (obj[0]['cod_bodega'] != 1) {
        queryDelete = `
          DELETE FROM bodegas WHERE bodegas.id_bodega = ${obj[0]['cod_bodega']};
        `
      }

      if (obj[0]['cod_casa'] != 1) {
        queryDelete = `
          DELETE FROM casas WHERE casas.id_casa = ${obj[0]['cod_casa']};
        `
      }

      if (obj[0]['cod_terreno'] != 1) {
        queryDelete = `
          DELETE FROM terrenos WHERE terrenos.id_terreno = ${obj[0]['cod_terreno']};
        `
      }
      if (obj[0]['cod_oficina'] != 1) {
        queryDelete = `
          DELETE FROM oficinas WHERE oficinas.id_oficina = ${obj[0]['cod_oficina']};
        `
      }
      console.log('queryDelete: ')
      console.log(queryDelete)

      db.query(deleteBien, function (err, result) {
        if (err)
          throw err
        else {
          console.log('One record deleted: on table bienes_raices')
        }
      })


      db.query(queryDelete, function (err, result) {
        if (err)
          throw err
        else {
          console.log('One record deleted: on parent table')
        }
      })

    }
  })

})

app.post('/altas', function (req, res) {
  const bien = req.body.select
  const ubicacion = req.body.Ubicacion
  const precio = req.body.Precio
  const superficie = req.body.Superficie
  const construccion = req.body.Construccion
  const caracteristicas = req.body.Caracteristicas
  const status = req.body.Status
  /*
  if (!req.files)
    return res.status(400).send('No files were uploaded.')

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/img.jpg', function (err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!')
  })*/
  switch (bien) {
    case 'div1':
      const noBanos = req.body.bano
      const recepcion = req.body.Recepcion
      const estacionamiento = req.body.Estacionamiento


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

          const queryOficinas_bienRaizOficina = `
          INSERT INTO bienes_raices (ubicacion, precio, superficie, contruccion, caracteristicas, status, cod_departamento, cod_bodega, cod_casa, cod_terreno, cod_oficina, cod_compra) VALUES
          ('${ubicacion}', '${precio}', '${superficie}', '${construccion}', '${caracteristicas}', '${status}', 1, 1, 1, 1, ${parseInt(result[0]['id_oficina'])}, 1);
          `
          console.log(queryOficinas_bienRaizOficina)


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
      ('${capacidadCochera}', '${numVestidor}', '${numRecamaras}', '${numBano}', '${cuartoServicio}', '${numSalastv}' , '${jardin}');
      `
      console.log(queryCasa)
      db.query(queryCasa, function (err, result) {
        if (err)
          throw err
        else {
          console.log('One record inserted(En tabla casas)')
        }
      })

      let queryGet = `
      SELECT id_casa FROM casas
      WHERE id_casa =(SELECT MAX(id_casa) FROM casas)
      `
      console.log(queryGet)

      db.query(queryGet, function (err, result) {
        if (err)
          throw err
        else {

          let id = parseInt(result[0]['id_casa'])

          const querycasas_bienRaizCasa = `
          INSERT INTO bienes_raices (ubicacion, precio, superficie, contruccion, caracteristicas, status, cod_departamento, cod_bodega, cod_casa, cod_terreno, cod_oficina, cod_compra) VALUES
          ('${ubicacion}', '${precio}', '${superficie}', '${construccion}', '${caracteristicas}', '${status}', 1, 1, ${parseInt(result[0]['id_casa'])}, 1, 1, 1);
          `
          console.log(querycasas_bienRaizCasa)


          db.query(querycasas_bienRaizCasa, function (err, result) {
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

let ID
app.post('/cambios', function (req, res) {
  ID = req.body.id
  const queryCodigos = `
  SELECT *
  FROM casas
  WHERE id_casa = ${ID}
  `
  const queryBien = `
  SELECT *
  FROM bienes_raices
  WHERE cod_casa = ${ID}
  `

  db.query(queryBien, function (err, result) {
    if (err)
      throw err
    else {
      let bien = result
      db.query(queryCodigos, function (err, result) {
        if (err)
          throw err
        else {
          let toHtml = result
          res.render('uploadChanges', {
            data: toHtml,
            data2: bien,
            id : ID
          })
        }
      })
    }
  })

})

app.post('/uploadChanges', function(req, res){
  let array = []

  ID = req.body.id
  
  let queryUpdateBienes

  const ubicacion = req.body.Ubicacion
  if (ubicacion.length != 0) {
    array.push(ubicacion)
    queryUpdateBienes = `
    UPDATE bienes_raices
    SET ubicacion = '${ubicacion}'
    WHERE cod_casa = '${ID}';
    `
  }
  const precio = req.body.Precio
  if (precio.length != 0) {
    array.push(precio)
    queryUpdateBienes = `
    ${queryUpdateBienes}
    UPDATE bienes_raices
    SET precio = '${precio}'
    WHERE cod_casa = '${ID}';
    `
  }  

  const superficie = req.body.Superficie
  
  if (superficie.length != 0){
    queryUpdateBienes = `
    ${queryUpdateBienes}
    UPDATE bienes_raices
    SET superficie = '${superficie}'
    WHERE cod_casa = '${ID}';
    `
  } 
  const construccion = req.body.Construccion
  if (construccion.length != 0){
    queryUpdateBienes = `
    ${queryUpdateBienes}
    UPDATE bienes_raices
    SET contruccion = '${construccion}'
    WHERE cod_casa = '${ID}';
    `
  }
  const caracteristicas = req.body.Caracteristicas
  if (caracteristicas.length != 0) {
    queryUpdateBienes = `
    ${queryUpdateBienes}
    UPDATE bienes_raices
    SET caracteristicas = '${caracteristicas}'
    WHERE cod_casa = '${ID}';
    `
  }
  const status = req.body.Status
  if (status != undefined){
    queryUpdateBienes = `
    ${queryUpdateBienes}
    UPDATE bienes_raices
    SET status = '${status}'
    WHERE cod_casa = '${ID}';
    `
  }

  console.log(queryUpdateBienes)

  

  let queryUpdateCasas 

  const capacidadCochera = req.body.cochera 
  if (capacidadCochera.length != 0){
    queryUpdateCasas = `
    UPDATE casas
    SET capacidad_cochera = '${capacidadCochera}'
    WHERE id_casa = '${ID}';
    `
  } 
  
  const numVestidor = req.body.vestidor
  if (numVestidor.length != 0){
    queryUpdateCasas = `
    UPDATE casas
    SET capacidad_cochera = '${numVestidor}'   
    WHERE id_casa = '${ID}';
    `
  } 

  const numRecamaras = req.body.recamara
  if (numRecamaras.length != 0){
    queryUpdateCasas = `
    ${queryUpdateCasas}
    UPDATE casas
    SET num_recamara = '${numRecamaras}'   
    WHERE id_casa = '${ID}';
    `
  } 

  const num = req.body.bano
  if (num.length != 0){
    queryUpdateCasas = `
    ${queryUpdateCasas}
    UPDATE casas
    SET num_bano = '${num}'   
    WHERE id_casa = '${ID}';
    `
  } 
 
  const cuartoServicio = req.body.servicio
  if (cuartoServicio != undefined){
    queryUpdateCasas = `
    ${queryUpdateCasas}
    UPDATE casas
    SET cuarto_servicio = '${cuartoServicio}'   
    WHERE id_casa = '${ID}';
    `
  } 
 
  const numSalastv = req.body.tv
  if (numSalastv.length != 0){
    queryUpdateCasas = `
    ${queryUpdateCasas}
    UPDATE casas
    SET num_sala_tv = '${numSalastv}'   
    WHERE id_casa = '${ID}';
    `
  } 

  const jardin = req.body.Jardin
  if (jardin != undefined){
    queryUpdateCasas = `
    ${queryUpdateCasas}
    UPDATE casas
    SET jardin = '${jardin}'   
    WHERE id_casa = '${ID}';
    `
  } 

  console.log(queryUpdateBienes)
  console.log(queryUpdateCasas)
  

  if(queryUpdateBienes != undefined){
    db.query(queryUpdateBienes, function (err, result) {
      if (err)
        throw err
      else {
        console.log('One record update on bienes_raices')
      }
    })
  }

  if(queryUpdateCasas != undefined){
    db.query(queryUpdateCasas, function (err, result) {
      if (err)
        throw err
      else {
        console.log('One record update on casas')
      }
    })
  }
  
})

app.listen(port, function () {
  console.log(messagePort)
})