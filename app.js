//requires
var express = require('express');
var mongoose = require('mongoose');


//inicializar var
var app = express();

//conect db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Data Base online');

});

//rutas
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

});

//escuchar peticiones
app.listen(8090, () => {
    console.log('Express serve port 8090');
});