const {StatusCodes} = require('http-status-codes');

const {AirplaneService} = require('../services');
const {SuccessResponse,ErrorResponse} = require('../utils/common');
/**
 * POST:/airplanes
 *  req -body {modelumber: 'airbus320' ,capacity:200}
 * res 
 */
async function createAirplane(req,res) {
    try {
       
        const airplane = await AirplaneService.createAirplane({
                modelNumber: req.body.modelNumber,
                capacity: req.body.capacity
        });
        SuccessResponse.data = airplane;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
};

   /**
 * GET:/airplanes/:id
 *  req -body {}
 * res 
 */
    async function getAirplanes(req,res) {
        try {
            const airplane = await AirplaneService.getAirplanes();
            SuccessResponse.data = airplane;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse); 
        } catch (error) {
            ErrorResponse.error = error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
        }
    };
  /**
 * GET:/airplanes/:id
 *  req -body {}
 * res 
 */
    async function getAirplane(req,res) {
        try {
            const airplane = await AirplaneService.getAirplane(req.params.id);
            SuccessResponse.data = airplane;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse); 
        } catch (error) {
            ErrorResponse.error = error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
        }
    };

     /**
 * DELETE:/airplanes/:id
 *  req -body {}
 * res 
 */
    async function destroyAirplane(req,res) {
        try {
            const airplane = await AirplaneService.destroyAirplane(req.params.id);
            SuccessResponse.data = airplane;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse); 
        } catch (error) {
            ErrorResponse.error = error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
        }
    };

/**
 * PATCH: /airplanes/:id
 * req.body { capacity: 250 }
 */
async function updateAirplane(req, res) {
    try {
        const airplane = await AirplaneService.updateAirplane(
            req.params.id,
            req.body   
        );

        SuccessResponse.data = airplane;

        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
};

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
};