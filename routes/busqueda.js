var express = require('express');
const { Promise } = require('mongoose');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ==========================================
// Busqueda todo
// ==========================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(regex),
            buscarMedico(regex),
            buscarUsuario(regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2],

            });
        })


});

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar los hospitales', err);
                } else {
                    resolve(hospitales);
                }
            })
    })


}


function buscarMedico(regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error cargando medicos', err);
                } else {
                    resolve(medicos);
                }
            })
    })
}

function buscarUsuario(regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error cargando usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    })
}


// ==========================================
// Busqueda por coleccion
// ==========================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'ususario':
            promesa = buscarUsuario(regex);
            break;

        case 'hospital':
            promesa = buscarHospitales(regex);
            break;

        case 'medico':
            promesa = buscarMedico(regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Debe introducir una coleccion correcta'

            });


    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data


        });
    })





})

module.exports = app;