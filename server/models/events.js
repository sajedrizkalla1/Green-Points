const { Schema, model } = require('mongoose');

const eventsSchema = new Schema({
    title: { type: String, required: true },
    location: { type: String, required: true }, // Now a string to store address information
    time: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    currentCapacity: { type: Number, required: true },
    description: { type: String, required: true }
}, { collection: 'events' });



const Events = model('event', eventsSchema);
module.exports = Events;