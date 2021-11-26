const db = require('../../database/models');
const sequelize = db.sequelize;
const getURL = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`;

const genresApiController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                res.status(200).json({
                    meta:{
                        total:genres.length,
                        status:200,
                        url: getURL(req)
                    },
                    data:genres
                })
            })
    },
    'detail': (req, res) => {
        if(req.params.id % 1 != 0){
            return res.status(422).json({
                status : 422,
                message : 'ID incorrecto'
            })
        }
        db.Genre.findByPk(req.params.id)
            .then(genre => {
                if(genre){
                    let response = {
                        meta:{
                            status:200,
                            url: getURL(req)
                        },
                        data:genre
                    }
                    return res.status(200).json(response)
                }else{
                    const error = new Error('Producto inexistente')
                    error.status = 400
                    throw error
                }
            });
    }

}

module.exports = genresApiController;