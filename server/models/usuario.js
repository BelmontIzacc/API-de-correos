const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
    id_usuario: {type: String, required: false},
    correo: { type: String, required: true },
    contrasena: { type: String, required: true },
    confirmado: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);