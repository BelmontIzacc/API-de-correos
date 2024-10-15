const jwt = require('jsonwebtoken');

// import para validar el token enviado

const autMiddleware = {};
const tk = "zcz0au22eiz3s23l4oie2V222";

autMiddleware.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader === undefined || authHeader === null) return res.sendStatus(404);
    const token = authHeader && authHeader.split(" ")[0];
    if(token == null) return res.sendStatus(404);
    jwt.verify(token, tk, (err, user) => {
        if(err) return res.sendStatus(404);
        req.uid = user.id;
        req.no_empleado = user.no_empleado;
        next();
    });

};

module.exports = autMiddleware;
