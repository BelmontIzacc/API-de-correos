const express = require('express');
const router = express.Router();

const correo = require('../controllers/correo.controller');

router.get('/correos', correo.getCorreos);
router.post('/correos', correo.createCorreo);
router.get('/correos/:id', correo.getCorreo);
router.put('/correos/:id', correo.editCorreo);
router.delete('/correos/:id', correo.deleteCorreo);

//router.get('/enviar', correo.enviarCorreo);

/*router.get('/:uid', function(req, res) {
    const uid = req.params.uid;
    res.render('../views/pages/index', { uid });
  });
*/

/*router.get('/', (req, res) => {
    res.send('Hola Mundo, API funcionando');
    /*res.json({
        status: 'Hola Mundo, API funcionando'
    });
});*/


module.exports = router;