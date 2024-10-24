const mongoose = require('mongoose');
require('dotenv').config();
//const URI = 'mongodb://localhost/api-correos';
const URI = process.env.DB_URI;
//const URI = 'mongodb+srv://Vania_10:Vania_10@idbird.psrme.mongodb.net/?retryWrites=true&w=majority&appName=IdBird';
// Conexión a MongoDB
mongoose.connect(URI)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;