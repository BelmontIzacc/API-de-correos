const express = require('express');
const router = express.Router();

const usuarioCtrl = require('../controllers/usuario.controller');
const correoCtrl = require('../controllers/correo.controller');

const autMiddleware = require('../middleware/authentication.middleware');
const verifyToken = autMiddleware.verifyToken;

const StandarException = require('../exception/StandarException');
const { token } = require('morgan');


router.post('/registrar', async (req, res, next) => {
    const user = req.body.correo;
    const pass = req.body.contrasena;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido; 
    const id_usuario = req.body.id_usuario;
    if (!user || !pass) {
        res.json(new StandarException('Datos incompletos', 400));
        return;
    }
    const respuesta_usuario = await usuarioCtrl.createUsuario(id_usuario, user, pass, nombre, apellido);
    console.log(respuesta_usuario);
    if (respuesta_usuario instanceof StandarException) {
        console.log(respuesta_usuario);
        res.json(respuesta_usuario);
        return;
    }
    const respuesta_correo = await correoCtrl.enviarCorreo(respuesta_usuario.usuario, respuesta_usuario.token);
    if (respuesta_correo instanceof StandarException) {
        console.log(respuesta_correo);
        res.json(respuesta_correo);
        return;
    }
    res.json({respuesta_usuario, respuesta_correo});
});

router.get('/confirmado/:token', async (req, res) => {
    console.log("req.params: ", req.params);
    const token = req.params.token;
    const respuesta = await usuarioCtrl.mostrarPagina(token, res);
    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        res.json(respuesta);
        return;
    }
    res.render("../views/pages/index");
});

router.get('/usuarios', verifyToken, async (req, res) => {
    const respuesta = await usuarioCtrl.getUsuarios();
    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        res.json(respuesta);
        return;
    }
    res.json(respuesta);
});

router.get('/usuarios/:id', verifyToken, async (req, res) => {
    const respuesta = await usuarioCtrl.getUsuario(req.params.id);
    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        res.json(respuesta);
        return;
    }
    res.json(respuesta);
});

router.put('/usuarios/:id', verifyToken, async (req, res) => {
    const respuesta = await usuarioCtrl.editUsuario(req.params.id, req.body);
    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        res.json(respuesta);
        return;
    }
    res.json(respuesta);
});

router.delete('/usuarios/:id', verifyToken, async (req, res) => {
    const respuesta = await usuarioCtrl.deleteUsuario(req.params.id);
    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        res.json(respuesta);
        return;
    }
    res.json(respuesta);
});

router.get('/enviarcorreo', verifyToken, async (req, res) => {
    const user = {
        correo: "prueba",
        contrasena: "prueba",
        id_usuario: "123456"
    };
    const token = "123456";
    const respuesta_correo = await correoCtrl.enviarCorreo(user, token);
    if (respuesta_correo instanceof StandarException) {
        console.log(respuesta_correo);
        res.json(respuesta_correo);
        return;
    }
    res.json({respuesta_usuario, respuesta_correo});
});

router.post('/usuarios/correo', async (req, res) => {
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    if (!correo || !contrasena) {
        return res.json(new StandarException('Correo y contraseña son requeridos', 400));
    }

    const respuesta = await usuarioCtrl.getUsuarioPorCorreoYContrasena(correo, contrasena);

    if (respuesta instanceof StandarException) {
        console.log(respuesta);
        return res.json(respuesta);
    }

    return res.json(respuesta);  // Enviar la información del usuario encontrado
});

// Esta ruta será una vista por defecto para rutas no definidas
router.get((req, res) => { res.render('404.ejs') });

module.exports = router;
