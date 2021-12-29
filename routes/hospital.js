var express = require('express');


var mdAutenticacion = require('../middlewares/autentication');

var app = express();

var Hospital = require('../models/hospital');
// ==========================================
// Obtener todos los hospitals
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }



                Hospital.find({}).count((err, cont) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando hospital',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: cont
                    });

                })



            });
});

// ==========================================
// Crear hospital
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {


    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuariotoken: req.usuario
        })


    })

})

// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })
        }

        if (!hospital) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe el hospital con id: ' + id,
                errors: { mensaje: 'No existe el hospital' }
            })
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });

            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuariotoken: req.usuario
            });


        })


    })

})

// ==========================================
// Borrar Hospital
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe el hospital con id: ' + id,
                errors: { mensaje: 'No existe el hospital' }
            })
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Hospital Borrado',
            hospital: hospitalBorrado,
            usuariotoken: req.usuario

        });
    })
})

module.exports = app;