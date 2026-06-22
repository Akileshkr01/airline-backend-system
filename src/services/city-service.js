const {StatusCodes} = require('http-status-codes');



const { CityRepository} = require('../repositories');


const AppError = require('../utils/errors/app-error');

const cityRepository = new CityRepository();


async function createCity(data) {
        try {
       
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        console.log(error.name);
        if(error.name == 'SequelizeValidationError' || error.name == "SequelizeUniqueConstraintError") {
            let explanation =[];
            console.log(error); 
            error.errors.forEach((err)=> {
                explanation.push(err.message);
            });
            console.log(explanation);
            throw new AppError(explanation , StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new city Object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function destroyCity(id) {
            try{
                const response = await cityRepository.destroy(id);
                return response;
            } catch(error){
                 console.log(error); 
                if(error.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError('The city requested to delete is not present ' , error.statusCode);
        }

                if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError(
                'Cannot delete city because it is associated with other records',
                StatusCodes.BAD_REQUEST
            );
        }

                throw new AppError('Cannot able to delete the  city', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        };

async function updateCity(id, data) {
    try {
        const response = await cityRepository.update(id, data);
        return response;

    } catch (error) {
        console.log(error);

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(
                'The city you are trying to update does not exist',
                StatusCodes.NOT_FOUND
            );
        }

        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });

            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new AppError(
            'Unable to update the city',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports ={
        createCity,
        destroyCity,
        updateCity


}