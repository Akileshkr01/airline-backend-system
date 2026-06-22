const {StatusCodes} = require('http-status-codes');
const {Op} = require('sequelize');
const { FlightRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
       
        const flight = await flightRepository.create(data);
        return flight;
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
        throw new AppError('Cannot create a new flight Object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


async function getAllFlights(query){
    let customFilter = {};
    let sortFilter = {};
    //const endingTripTime = "23:59:00";
    // trips = MUM-DEL
    if(query.trips){
        [departureAirportId,arrivalAirportId] = query.trips.split('-');
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
        //TODO: Add a check that they are not same 
    }
    if(query.price){
        [minPrice , maxPrice] = query.price.split('-');
        console.log(minPrice,maxPrice);
        customFilter.price = {
            [Op.between] : [minPrice , (maxPrice == undefined) ? 20000:maxPrice]
        };
    }
    if(query.travellers){
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
       if (query.tripDate) {
        const startDate = `${query.tripDate} 00:00:00`;
        const endDate = `${query.tripDate} 23:59:59`;

        customFilter.departureTime = {
            [Op.between]: [startDate, endDate]
        };
    }
if (query.sort) {
    const params = query.sort.split(',');

    sortFilter = params.map(param => {
        const [field, direction] = param.split('_');

        return [
            field,
            direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
        ];
    });
}
    console.log(customFilter,sortFilter);
    try {
         const flight = await flightRepository.getAllFlights(customFilter,sortFilter);
        return flight;
    } catch (error) {
            console.error("REAL ERROR:", error);  
    throw error;  
         throw new AppError('Cannot get a flight Object' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function getFlight(id) {
    try {
        const flight = await flightRepository.get(id);

        if (!flight) {
            throw new AppError(
                'The flight requested is not present',
                StatusCodes.NOT_FOUND
            );
        }

        return flight;

    } catch (error) {

        if (error instanceof AppError) {
            throw error;
        }

        console.log("Flight Fetch Error:", error);

        throw new AppError(
            'Cannot fetch data of the flight',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


async function updateSeats(data){
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId,data.seats,data.dec);
        return response;
    } catch (error) {
         console.log(error);
         throw new AppError('Cannot update data of  the flight' , StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
module.exports = {
    createFlight,
     getAllFlights,
     getFlight,
      updateSeats
};