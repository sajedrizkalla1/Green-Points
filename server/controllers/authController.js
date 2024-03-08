const constants = require('../constants');
const { SECRET,EMAIL,EMAILPASSWORD } = constants;
const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");

exports.authController = {

    async login(req, res) {
        const email = String(req.body.email).toLowerCase();
        try {
            const user = await User.findOne({ email })
            if (!user) {
                errorLogger.error("Wrong user email please enter correct email");
                res.status(400).json({ "message": "Wrong user email please enter correct email" });
                return;
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({ id: user._id }, SECRET, {
                expiresIn: 14 * 86400 //  14*24 hours
            });
            let userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                registerDate: user.registerDate,
                volunteerEvents: user.volunteerEvents,
                isOrganizer: user.isOrganizer,
                accessToken: token
            }
            if (user.isOrganizer) {
                userResponse.OrganizerEvents = user.OrganizerEvents
            }

            res.status(200).json(userResponse);
        }
        catch (err) {
            errorLogger.error(`Error Getting user from db:${err}`);
            res.status(500).json({ "message": `Error getting user ` });
        }
    },
};