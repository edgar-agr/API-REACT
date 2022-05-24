const express = require('express');
const plantsController = require('../controller/plants');

const router = express.Router();

router.get('/plants',plantsController.getPlants);

router.get('/plant/:id',plantsController.getPlant);

router.put('/plant/:id',plantsController.editPlant);

module.exports = router;