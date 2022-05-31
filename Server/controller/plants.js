const {validationResult} = require('express-validator')

const Plants = require('../models/plant');

exports.getPlants = (req,res,next) => {
    const page = req.query.page || 1;
    let ecosystem = req.query.ecosystem || 'All';
    const perPage = 5;
    let totalPlants;

    if(ecosystem === 'All'){
        ecosystem = ['Forest','Grassland','Desert','Tundra','Freshwater','Marine'];
    }

    Plants
        .find({ecosystem:ecosystem})
        .countDocuments()
        .then(count =>{
            if(count === 0){
                const error = new Error('No Plants Found');
                error.statusCode = 404;
                throw error
            }

            if(count < (page-1)*5){
                const error = new Error('Invalid page number');
                error.statusCode = 422;
                throw error
            }
            totalPlants = count;

            return Plants
                .find({ecosystem:ecosystem})
                .skip((page-1)*5)
                .limit(perPage);
        })
        .then(result =>{
            res.status(200).json({
                plants:result,
                total: totalPlants,
                page:page,
                perpage:perPage,
                message:'Fetch succesful'});
        })
        .catch(error =>{
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.getPlant = (req,res,next) => {
    const plantId = req.params.id;
    
    if(!plantId){
        const error = new Error('Insert a plant id');
        error.statusCode = 422;
        throw error;
    }

    Plants
        .findById(plantId)
        .then(result =>{
            if(!result){
                const error = new Error('Plant not found');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message:"Plant found",
                plant:result
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.editPlant = (req,res,next) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }

    const plantId = req.params.id;

    if(!plantId){
        const error = new Error('Insert a plant id');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const ecosystem = req.body.ecosystem;

    Plants
      .findById(plantId)
      .then(result => {
          if(!result){
            const error = new Error('Plant not found');
            error.statusCode = 404;
            throw error;
          }

          result.name = name;
          result.description = description;
          result.price = price;
          result.imgUrl = imgUrl;
          result.ecosystem = ecosystem;

          return result.save();
      })
      .then(plant => {
          res.status(200).json({
              message:'Plant updated succesfully',
              plant:plant
          });
      })
      .catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
      })
};

exports.createPlant = (req,res,next) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.');
    //     error.statusCode = 422;
    //     throw error;
    // }

    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const imgUrl = req.body.imgUrl;
    const ecosystem = req.body.ecosystem;
    
    Plants
        .findOne({name:name})
        .then(result => {
            if(result){
                const error = new Error('Plant already exists');
                error.statusCode = 400;
                throw error;
            }

            const plant = new Plants({
                name:name,
                description:description,
                price:price,
                imgUrl:imgUrl,
                ecosystem:ecosystem
            });

            return plant.save()
        })
        .then(result => {
            res.status(201).json({
                message:'Plant created successfullly',
                plant:result
            });
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};

exports.deletePlant = (req,res,next) => {
    const id = req.params.id;

    if(!id){
        const error = new Error('Insert a plant id');
        error.statusCode = 422;
        throw error;
    }

    Plants
        .findById(id)
        .then(plant => {
            if(!plant){
                const error = new Error('Plant not found!');
                error.statusCode = 404;
                throw error;
            }

            return Plants.findByIdAndDelete(id)
        })
        .then(result => {
            res.status(200).json({
                message:'plant deleted successfully',
                plant:result
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        })
};