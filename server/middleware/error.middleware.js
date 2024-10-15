// Middleware de manejo de errores personalizado
function handleError(error, req, res, next){

    // Recupera los datos del error
    const respuesta = {
        estatus: false,
        mensaje: error.mensaje || 'Error interno del servidor',
        codigo: error.codigo,
        extra: ""
    }
    if (error.extra !== undefined && error.extra !== null) {
        respuesta.extra = error.extra;
    } else {
        delete respuesta.extra;
    }

    res.status(error.estatus || 500).json(respuesta);
}

module.exports = handleError;