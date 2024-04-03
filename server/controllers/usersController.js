const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.usersController = {
    getUsers(req, res) {
        infoLogger.info("Get all Users");
        User.find({})
            .then(user => {
                infoLogger.info("Success to Get all users");
                res.json(user)
            })
            .catch(err => {
                errorLogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets users ` });
            });
    },
    getUserDetails(req, res) {
        infoLogger.info(`Get User id:${req.params.id}`);
        User.findOne({ _id: req.params.id })
            .then((user) => {
                if (user) {
                    res.json(user)
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting user from db:${err}`);
                res.status(500).json({ "message": `Error getting user ` });
            });
    },
    async editUserDetails(req, res) {
        infoLogger.info("Updating a user");
    
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                errorLogger.error(`User not found with id: ${req.params.id}`);
                return res.status(404).json({ "message": "User not found" });
            }
    
            // Check if the old password is correct before allowing updates
            if (req.body.oldPassword) {
                const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
                if (!isMatch) {
                    errorLogger.error(`Old password does not match for user no: ${req.params.id}`);
                    return res.status(400).json({ "message": "Old password is incorrect" });
                }
    
                // If there's a new password, hash it
                if (req.body.password) {
                    req.body.password = bcrypt.hashSync(req.body.password, 8);
                }
            }
    
            // Prepare the update object, excluding oldPassword from the update
            const updateData = { ...req.body };
            delete updateData.oldPassword; // Remove oldPassword as it's not part of the User model
    
            const updateResult = await User.updateOne({ _id: req.params.id }, { $set: updateData });
    
            if (updateResult.matchedCount > 0) {
                infoLogger.info(`User details update for user no:${req.params.id} is successfully`);
                res.json({ "message": `User details update for user no:${req.params.id} is successfully` });
            } else {
                errorLogger.error("No matching user found to update");
                res.status(400).json({ "message": "No matching user found to update" });
            }
        } catch (err) {
            errorLogger.error("Error updating user details", err);
            res.status(500).json({ "message": "Error updating user details", error: err });
        }
    },    
    async deleteUser(req, res) {
        infoLogger.info("Delete a user");

        User.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting user no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting user no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`user no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `user no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting user no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting user no:${req.params.id} ` });
            });
    },
    async addVolunterEvent(req, res) {
        infoLogger.info(`Add Activity to user ${req.params.id}`);
        const { eventId } = req.body;
        console.log(req.body);
    
        if (!eventId) {
            errorLogger.error("Missing event ID");
            return res.status(400).json({ "message": "Missing event ID" });
        }
    
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                errorLogger.error(`No user found with id ${req.params.id}`);
                return res.status(404).json({ "message": `No user found with id ${req.params.id}` });
            }
    
            // Assuming eventId is a valid event ID that should be added to volunteerEvents
            if (!user.volunteerEvents.includes(eventId)) {
                user.volunteerEvents.push(eventId);
                const updatedUser = await User.updateOne(
                    { _id: req.params.id },
                    { $set: { volunteerEvents: user.volunteerEvents } }
                );
    
                if (updatedUser.matchedCount > 0) {
                    infoLogger.info(`Event ${eventId} added to user ${req.params.id}'s volunteer events successfully`);
                    return res.json({ "message": `Event ${eventId} added to volunteer events successfully` });
                } else {
                    errorLogger.error(`Failed to add event to user ${req.params.id}'s volunteer events`);
                    return res.status(400).json({ "message": "Failed to add event" });
                }
            } else {
                return res.status(409).json({ "message": "Event already added to volunteer events" });
            }
        } catch (err) {
            errorLogger.error(`Error updating volunteer events for user ${req.params.id}: ${err}`);
            return res.status(500).json({ "message": "Error updating volunteer events", error: err });
        }
    },
    async addOrganizerEvent(req, res) {
        infoLogger.info(`Attempting to add event to organizer ${req.params.id}`);
    
        // Additional check to ensure that the user is marked as an organizer
        const organizer = await User.findOne({ _id: req.params.id });
        if (!organizer) {
            errorLogger.error(`User not found: ${req.params.id}`);
            return res.status(404).json({ "message": "User not found" });
        }
    
        if (!organizer.isOrganizer) {
            errorLogger.error(`User ${req.params.id} is not an organizer`);
            return res.status(403).json({ "message": "User is not authorized to organize events" });
        }
    
        const { eventId } = req.body;
        if (!eventId) {
            errorLogger.error("Missing event ID in request");
            return res.status(400).json({ "message": "Missing event ID" });
        }
    
        // Add eventId to OrganizerEvents if it's not already present
        if (!organizer.OrganizerEvents.includes(eventId)) {
            organizer.OrganizerEvents.push(eventId);
            await User.updateOne({ _id: req.params.id }, { $set: { OrganizerEvents: organizer.OrganizerEvents } });
    
            infoLogger.info(`Event ${eventId} added to organizer ${req.params.id}'s OrganizerEvents successfully`);
            return res.json({ "message": `Event added to OrganizerEvents successfully` });
        } else {
            return res.status(409).json({ "message": "Event already exists in OrganizerEvents" });
        }
    },
}
