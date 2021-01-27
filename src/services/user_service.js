'use strict';
const logger = require('../config/log4js_config');
const headerSchema = require('../schemas/header_schema');
const Usuario = require('../models/Usuario');

class User {
    /**
     * @method
     * @description Valida el request de la solicitud
     * @param {object} req Objeto que contiene request de la solicitud
     */
    validarRequestListUser(req) {
        const Ajv = require('ajv');
        const ajv = new Ajv();
        let headers = req.headers;
        let valid;

        return new Promise((resolve, reject) => {
            logger.info('Validando request de la solicitud');
            // Validando headers de la solicitud
            valid = ajv.validate(headerSchema, headers);

            if (!valid) {
                logger.info('Solicitud inválida - Headers inválidos!');

                // Llamando a metodo que arma objeto error
                reject(this.handlingError(400, '400', `${ajv.errors[0].message}`));
            } else {
                logger.info('Solicitud válida!');
                resolve(req);
            }
        });
    }

    /**
     * @method
     * @description Lista un usuario de la DB
     * @param {object} req Objeto que contiene request de la solicitud
     * @returns {object} Retorna un error o un objeto con el request
     */
    listarUsuarioDB(req, res) {
        let email = req.params.email;

        logger.info('Buscando usuario en base de datos');
        Usuario.findOne({ email: email }, (err, usuarioDB) => {
            if (err) {
                logger.error('Error al obteneder usuario: ', err);
                return res.status(502).json({
                    code: '502',
                    message: 'Bad Gateway'
                });
            } else {
                if (!usuarioDB) {
                    logger.error('Usuario no Existe en BD');
                    res.json({});
                } else {
                    logger.info('Usuario Encontrado en BD');
                    res.json({
                        data: {
                            usuario: usuarioDB
                        }
                    });
                }
            }
        });
    }

    /**
     * @method
     * @description Metodo para crear estructura de objeto error
     * @param {integer} status código estado de respuesta HTTP
     * @param {String} code codigo de error
     * @param {String} message mensaje de error
     * @returns {object} devuelv objeto error
     */
    handlingError(status, code, message) {
        let error = new Object();
        error.status = status;
        error.code = code;
        error.message = message;
        return error;
    }
}

module.exports = User;
