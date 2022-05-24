const express = require('express');
const plantsController = require('../controller/plants');

const router = express.Router();

router.get('/plants',plantsController.getPlants);

router.get('/plant/:id',plantsController.getPlant);

router.post('/addPlant',plantsController.createPlant);

router.put('/plant/:id',plantsController.editPlant);

router.delete('/plant/:id',plantsController.deletePlant);

module.exports = router;