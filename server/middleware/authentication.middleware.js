const jwt = require('jsonwebtoken');

// import para validar el token enviado

const autMiddleware = {};
const key = process.env.TOKEN_KEY;

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


autMiddleware.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    //console.log(authHeader);
    if (authHeader === undefined || authHeader === null) return res.sendStatus(404);
    const token = authHeader && authHeader.split(" ")[1];
    //console.log(token);
    if(token == null) return res.sendStatus(404);
    //console.log(key);
    jwt.verify(token, key, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }
        if (user.id == process.env.AUTHENTIFICATION_KEY) {
            //console.log(user.id);
            req.userId = user.id;
            next();
        }
    });
};

autMiddleware.verifyTokenCorreo = (req, res, next) => {
    const authHeader = req.params.acceso;
    if (authHeader === undefined || authHeader === null) return res.sendStatus(404);
    const token = authHeader && authHeader.split(" ")[0];
    if(token == null) return res.sendStatus(404);
    jwt.verify(token, tk, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }
        next();
    });

};

module.exports = autMiddleware;