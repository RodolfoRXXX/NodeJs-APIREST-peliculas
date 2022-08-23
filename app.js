var express = require('express');

var mysql = require('mysql');

var cors = require('cors');

var app = express();

app.use(cors());

app.use(express.json());

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
    console.log('Servidor Ok en el puerto: ' + puerto);
})

//Configuramos los datos de la conexión
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'videoclub'
})

//Probamos la conexión
conexion.connect( (error) => {
    if(error)throw error;

    console.log(`Conexión a base de datos exitosa!`);
} )

app.get('/', (req, res) => {
    res.send('Ruta INICIO');
})

//Método para traer todos los artículos desde la DB
app.get('/api/peliculas', (req, res) => {
    conexion.query('SELECT * FROM peliculas', (error, filas) => {
        if(error)throw error;

        res.send(filas);
    })
})

//Método para mostrar un artículo en particular
app.get('/api/peliculas/:id', (req, res) => {
    conexion.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (error, fila) => {
        if(error)throw error;

        res.send(fila);
        //res.send(fila[0].titulo);
    })
})

//Método para agregar un artículo
app.post('/api/peliculas', (req, res) => {
    let data = { 
                titulo: req.body.titulo,
                genero: req.body.genero,
                year: req.body.year,
                stock: req.body.stock,
                precio: req.body.precio,
                sinopsis: req.body.sinopsis,
                imdb: req.body.imdb,
                foto: req.body.foto    
            };
    let sql = "INSERT INTO peliculas SET ?";
    conexion.query( sql, data, (error, results) => {
        if(error)throw error;
        res.send(results);
    } )
})

//Método para actualizar un registro
app.put('/api/peliculas/:id', (req, res) => {
    let data = {
                titulo: req.body.titulo,
                genero: req.body.genero,
                year: req.body.year,
                stock: req.body.stock,
                precio: req.body.precio,
                sinopsis: req.body.sinopsis,
                imdb: req.body.imdb,
                foto: req.body.foto,
                id: req.params.id
            };
    let sql = "UPDATE peliculas SET titulo= ?, genero= ?, year= ?, stock= ?, precio= ?, sinopsis= ?, imdb= ?, foto= ? WHERE id = ?";
    conexion.query( sql, [data.titulo, data.genero, data.year, data.stock, data.precio, data.sinopsis, data.imdb, data.foto, data.id ], (error, result) => {
        if(error)throw error;
        res.send(result);
    } )
})

//Método para eliminar un registro
app.delete('/api/peliculas/:id', (req, res) => {
    conexion.query("DELETE FROM peliculas WHERE id = ?", [req.params.id], (error, result) => {
        if(error)throw error;
        res.send(result);
    })
})