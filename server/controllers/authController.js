const constants = require('../constants');
const { SECRET,EMAIL,EMAILPASSWORD } = constants;
const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");

exports.authController = {
    signup(req, res) {
        infoLogger.info("Organizer signup");
        const { name, email, age, gender, password, isOrganizer } = req.body;
        if (name, email, age, gender, password) {
            let IsOrganizer = isOrganizer === 'true' || isOrganizer === true;
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        // Prepare the user data object

                        let userData = {
                            name,
                            email,
                            age,
                            gender,
                            password: bcrypt.hashSync(password, 8),
                            registerDate: new Date().toLocaleString(),
                            isOrganizer: IsOrganizer, // Explicitly include isOrganizer as a boolean
                            volunteerEvents: [], // Default for all users
                        };

                        // Conditionally add OrganizerEvents if isOrganizer is true
                        if (IsOrganizer) {
                            console.log('heree');
                            userData.OrganizerEvents = [];
                        }

                        // Create a new user instance with the prepared data
                        const newUser = new User(userData);

                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding User  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding User `);
                                res.status(400).json({ "message": `Error Adding User ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error User user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    
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