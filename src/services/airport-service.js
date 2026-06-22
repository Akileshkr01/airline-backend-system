const {StatusCodes} = require('http-status-codes');
const { AirportRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const airportRepository = new AirportRepository();

async function createAirport(data) {
    try {
       
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        console.log(error.name);
        if(error.name == 'SequelizeValidationError') {
            let explanation =[];
            console.log(error);
            error.errors.forEach((err)=> {
                explanation.push(err.message);
            });
            console.log(explanation);
            throw new AppError(explanation , StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new airport Object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function getAirports() {
        try{
            const airports = await airportRepository.getAll();
            return airports;

        }
        catch(error){
             throw new AppError('Cannot cannot fetch data of all the airports' , StatusCodes.INTERNAL_SERVER_ERROR);
        }
    };

async function getAirport(id) {
        try{
            const airports = await airportRepository.get(id);
            return airports;

        }
        catch(error){
            if(error.statusCode == StatusCodes.NOT_FOUND){
                throw new AppError('The airport requested is not present ' , error.statusCode);
        }
            }
             throw new AppError('Cannot cannot fetch data of  the airport' , StatusCodes.INTERNAL_SERVER_ERROR);
        };
    
async function destroyAirport(id) {
            try{
                const response = await airportRepository.destroy(id);
                return response;
            } catch(error){
                if(error.statusCode == StatusCodes.NOT_FOUND){
                throw new AppError('The airport requested to delete is not present ' , error.statusCode);
        }
                throw new AppError('Cannot able to delete the  airports', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        };

 async function updateAirport(id, data) {
    try {
        const response = await airportRepository.update(id, data);
        return response;

    } catch (error) {

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(
                'The airport you are trying to update does not exist',
                StatusCodes.NOT_FOUND
            );
        }

        throw new AppError(
            'Unable to update the airport',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport

} 