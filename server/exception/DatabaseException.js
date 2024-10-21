const HttpException = require('./HttpException');

// Definición del error personalizado para la base de datos
class DatabaseException extends HttpException {
    constructor(mensaje, codigo, extra) {
        super(8000, mensaje, codigo, extra);
    }
}

module.exports = DatabaseException;