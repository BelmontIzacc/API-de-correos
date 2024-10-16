const jwt = require('jsonwebtoken');

// import para validar el token enviado

const autMiddleware = {};
const key = "VSSL";

//Validación de token
autMiddleware.verifyTokenInURL = (req, res, next) => {
    // Obtener el token desde los parámetros de la URL
    const token = req.params.token; 
    console.log(token);
    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        req.userId = decoded.id; // Almacenar el ID del usuario decodificado en la solicitud para su uso posterior
        console.log(req.userId);
        next(); // Continuar con la siguiente función de middleware o controlador de ruta
    });
};

module.exports = autMiddleware;