const { Schema, model } = require('mongoose');


const UserSchema = new Schema( {
    name: { type: String, required: true },
    email: { type: String, required: true, set: email => String(email).toLowerCase() },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    registerDate: { type: String, required: true },
    isOrganizer : { type: Boolean, required: true },
    OrganizerEvents: [{ type: String }],
    volunteerEvents: [{ type: String }] 
}, { collection: 'users' });

const User = model('User', UserSchema);

module.exports = User ;
