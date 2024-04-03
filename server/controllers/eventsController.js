const Events = require('../models/events'); // Assuming this is the correct path
const { infoLogger, errorLogger } = require("../logs/logs");
const User = require('../models/users'); // Assuming you're storing user data here

exports.eventsController = {
    async addEvent(req, res) {
        const organizer = await User.findOne({ _id: req.userId });
        if (!organizer || !organizer.isOrganizer) {
            errorLogger.error(`Unauthorized or not an organizer: ${req.userId}`);
            return res.status(403).json({ "message": "Unauthorized or not an organizer" });
        }
    
        const { title, location, time, maxCapacity, description } = req.body;
        console.log(title, location, time, maxCapacity, description);
        const newEvent = new Events({
            title,
            location,
            time,
            maxCapacity,
            currentCapacity: 0, // Assuming starting at 0
            description
        });
    
        try {
            const savedEvent = await newEvent.save();
            infoLogger.info(`Event created successfully: ${savedEvent._id}`);
    
            // Update the organizer's document to include the new event's ID in OrganizerEvents
            await User.updateOne(
                { _id: req.userId },
                { $push: { OrganizerEvents: savedEvent._id.toString() } }
            );
    
            // Respond with the saved event
            res.status(201).json({ message: "Event created successfully", eventId: savedEvent._id.toString() });
        } catch (err) {
            errorLogger.error(`Error creating event: ${err}`);
            res.status(500).json({ "message": "Error creating event", error: err });
        }
    },    

    async deleteEvent(req, res) {
        const organizer = await User.findOne({ _id: req.userId });
        if (!organizer || !organizer.isOrganizer) {
            errorLogger.error(`Unauthorized or not an organizer: ${req.userId}`);
            return res.status(403).json({ "message": "Unauthorized or not an organizer" });
        }

        try {
            const result = await Events.deleteOne({ _id: req.params.id });
            if (result.deletedCount > 0) {
                infoLogger.info(`Event deleted successfully: ${req.params.id}`);
                res.json({ "message": "Event deleted successfully" });
            } else {
                errorLogger.error(`Event not found: ${req.params.id}`);
                res.status(404).json({ "message": "Event not found" });
            }
        } catch (err) {
            errorLogger.error(`Error deleting event: ${err}`);
            res.status(500).json({ "message": "Error deleting event", error: err });
        }
    },

    async getEvents(req, res) {
        try {
            const events = await Events.find({});
    
            // Convert string dates to Date objects and filter
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.time);
                return eventDate > new Date();
            }).sort((a, b) => new Date(a.time) - new Date(b.time));
    
            infoLogger.info("Fetched all future events");
            res.json(filteredEvents);
        } catch (err) {
            errorLogger.error(`Error fetching events: ${err}`);
            res.status(500).json({ "message": "Error fetching events", error: err });
        }
    }
    ,    

    async getEventById(req, res) {
        try {
            const event = await Events.findById(req.params.id);
            if (event) {
                res.json(event);
            } else {
                errorLogger.error(`Event not found: ${req.params.id}`);
                res.status(404).json({ "message": "Event not found" });
            }
        } catch (err) {
            errorLogger.error(`Error fetching event: ${err}`);
            res.status(500).json({ "message": "Error fetching event", error: err });
        }
    },

    async applyToEvent(req, res) {
        try {
            const { eventId } = req.params; // Get eventId from URL parameter
            const userId = req.userId; // Assuming this is set by your authentication middleware
    
            const event = await Events.findById(eventId);
            if (!event) {
                return res.status(404).json({ "message": "Event not found" });
            }
    
            if (event.currentCapacity >= event.maxCapacity) {
                return res.status(400).json({ "message": "Event is at full capacity" });
            }
    
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ "message": "User not found" });
            }
    
            // Check if the user has already applied
            if (user.volunteerEvents && user.volunteerEvents.includes(eventId)) {
                return res.status(400).json({ "message": "User has already applied to this event" });
            }
    
            // Increment the event's current capacity
            event.currentCapacity += 1;
            await event.save();
    
            // Add the event to the user's volunteerEvents array
            user.volunteerEvents = user.volunteerEvents || [];
            user.volunteerEvents.push(eventId);
            await user.save();
    
            res.json({ "message": "Successfully applied to event", event });
        } catch (err) {
            errorLogger.error(`Error applying to event: ${err}`);
            res.status(500).json({ "message": "Error applying to event", error: err });
        }
    },
    
    async updateEvent(req, res) {
        const { id: eventId } = req.params;
        const { title, location, maxCapacity, time, description } = req.body;
    
        try {
            const organizer = await User.findOne({ _id: req.userId });
            if (!organizer || !organizer.isOrganizer) {
                errorLogger.error(`Unauthorized or not an organizer: ${req.userId}`);
                return res.status(403).json({ "message": "Unauthorized or not an organizer" });
            }
    
            const eventToUpdate = await Events.findById(eventId);
            if (!eventToUpdate) {
                errorLogger.error(`Event not found: ${eventId}`);
                return res.status(404).json({ "message": "Event not found" });
            }
    
            // Assuming only certain fields are allowed to be updated
            eventToUpdate.title = title;
            eventToUpdate.location = location;
            eventToUpdate.maxCapacity = maxCapacity;
            eventToUpdate.time = time;
            eventToUpdate.description = description;
    
            await eventToUpdate.save();
            
            infoLogger.info(`Event updated successfully: ${eventId}`);
            res.json({ "message": "Event updated successfully", event: eventToUpdate });
        } catch (err) {
            errorLogger.error(`Error updating event: ${err}`);
            res.status(500).json({ "message": "Error updating event", error: err });
        }
    }
    
    
};



