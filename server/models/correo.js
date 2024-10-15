const mongoose = require('mongoose');
const { Schema } = mongoose;

const CorreoSchema = new Schema({
    destinatario: { type: String, required: true },
    cuerpo_correo: { type: String, required: true },
    link_dinamico: { type: String, required: true }
});

module.exports = mongoose.model('Correo', CorreoSchema);