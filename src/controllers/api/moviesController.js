const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const getURL = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`;
const getURLBase = req => `${req.protocol}://${req.get('host')}`;

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesApiController = {
    create: async (req,res) => {
        console.log(req.body);
        try {
            const movie = await Movies.create({
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            })
            let response = {
                meta : {
                    url : getURL(req),
                    status : 201,
                    message : 'Producto agregado con éxito'
                },
                data: movie
                
            }
            return res.status(201).json(response)
        } catch (error) {
            return res.status(400).json({
                status : 400,
                messages : error.errors.map(error => error.message)
            })
        }
    },
    destroy: async (req,res)=> {
        let movieId = req.params.id;
        if(movieId % 1 != 0){
            return res.status(422).json({
                status : 422,
                message : 'ID incorrecto'
            })
        }
        try {
            const movie = await Movies.destroy({where: {id: movieId}, force: true})
            
            if(movie){
                let response = {
                    meta : {
                        url : getURL(req),
                        status : 201,
                        message : 'Película eliminada con éxito'
                    },
                    data: movie
                    
                }
                return res.status(201).json(response)
            }else{
                const error = new Error('Película inexistente')
                error.status = 400
                throw error
            }
            
        } catch (error) {
            return res.status(400).json({
                status : 400,
                messages : error.errors.map(error => error.message)
            })
        }
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    }
}

module.exports = moviesApiController;