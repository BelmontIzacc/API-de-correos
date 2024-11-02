
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    
    res.render('../views/maps/maps.ejs');
});

module.exports = router;
