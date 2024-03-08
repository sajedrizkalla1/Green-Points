const { Schema, model } = require('mongoose');

const addressSchema = new Schema({
   lat : {type:Number},
   lng : {type:Number}
});

const eventsSchema = new Schema({
    title: { type: String, required: true },
    location:addressSchema,
    time: {type: String, required: true},
    maxCapacity: { type: Number, required: true },
    currentCapacity: { type: Number, required: true },
    description: { type: String, required: true }
}, { collection: 'events' });

eventsSchema
    .path('type')
    .set(type => String(type).toLowerCase());

const RecycleBin = model('event', eventsSchema);
module.exports = RecycleBin;