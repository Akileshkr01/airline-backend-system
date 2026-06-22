const {Sequelize} = require('sequelize');

const CrudRepository = require('./crud-repository');
const {Flight, Airplane,Airport,City} = require('../models');
const { where } = require('sequelize');
const db = require('../models');
const {addRowLockOnFlights} = require('./queries');

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

   async getAllFlights(filter = {}, sort = []) {
    try {
        const response = await Flight.findAll({
            where: filter,
            order: Array.isArray(sort) ? sort : [],
            include: [
                {
                    model: Airplane ,
                    required: true,
                    as:"airplaneDetail"
                },
                 {
                    model: Airport ,
                    required: true,
                    as:'departureAirport',
                    on:{
                        col1: Sequelize.where(Sequelize.col('Flight.departureAirportId'),"=",Sequelize.col("departureAirport.code"))
                    },
                    include:{
                        model: City,
                        required: true
                    }
                },
                {
                    model: Airport ,
                    required: true,
                    as:'arrivalAirport',
                    on:{
                        col1: Sequelize.where(Sequelize.col('Flight.arrivalAirportId'),"=",Sequelize.col("arrivalAirport.code"))
                    },
                    include:{
                        model: City,
                        required: true
                    }
                }
            ]
        });

        return response;
    } catch (error) {
        throw error;
    }
}

async updateRemainingSeats(flightId, seats, dec = true) {

    const transaction = await db.sequelize.transaction();

    try {

        const flight = await Flight.findByPk(flightId, { transaction });

        const decrement = parseInt(dec);

        if (decrement) {
            await flight.decrement('totalSeats', {
                by: seats,
                transaction
            });
        } else {
            await flight.increment('totalSeats', {
                by: seats,
                transaction
            });
        }

        await transaction.commit();

        return flight;

    } catch (error) {

        await transaction.rollback();
        throw error;

    }
}

};

module.exports = FlightRepository;