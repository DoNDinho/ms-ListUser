'use strict';
const logger = require('../config/log4js_config');
const User = require('../services/user_service');

exports.listUser = async (req, res) => {
    try {
        let transactionId = req.headers.transaction_id;
        logger.addContext('transaction_id', transactionId);

        let user = new User();

        try {
            await user.validarRequestListUser(req, res);
            user.listarUsuarioDB(req, res);
        } catch (err) {
            // Obteniendo datos de objeto error
            let status = err.status;
            let code = err.code;
            let message = err.message;

            // Devolviendo respuesta error
            return res.status(status).json({
                code,
                message
            });
        }
    } catch (err) {
        logger.error('Ha ocurrido un error en método listUser controller ', err);
        return res.status(500).json({
            code: '500',
            message: 'Internal Server Error'
        });
    }
};
