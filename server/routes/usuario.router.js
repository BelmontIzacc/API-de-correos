const express = require('express');
const router = express.Router();

const usuario = require('../controllers/usuario.controller');
const autMiddleware = require('../middleware/authentication.middleware');

router.get('/usuarios', usuario.getUsuarios);
router.post('/usuarios', usuario.createUsuario);
router.get('/usuarios/:id', usuario.getUsuario);
router.put('/usuarios/:id', usuario.editUsuario);
router.delete('/usuarios/:id', usuario.deleteUsuario);
router.get('/prueba', usuario.usarIdUsuario);

router.get('/enviarcorreo', usuario.enviarCorreo);
//router.get('/confirmado/:id_usuario', usuario.mostrarPagina);
router.get('/confirmado/:token', autMiddleware.verifyTokenInURL, async (req, res) => {
    id_usuario = req.userId;
    console.log(id_usuario);
    usuario.mostrarPagina(id_usuario, res);
});


// Esta ruta será una vista por defecto para rutas no definidas
router.get((req, res) => { res.render('404.ejs') });

module.exports = router;
