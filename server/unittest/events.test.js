const { eventsController } = require('../controllers/eventsController');
const { User } = require('../models/users');
const { Events } = require('../models/events');
const { infoLogger, errorLogger } = require("../logs/logs");

jest.mock("../models/users");
jest.mock("../models/events");
jest.mock("../logs/logs");

describe("eventsController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("addEvent", () => {
        it("should return 403 if userId is not provided in request", async () => {
            // Setting userId to undefined in the request
            req.userId = undefined;

            await eventsController.addEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "message": "Unauthorized or not an organizer" });
            expect(errorLogger.error).toHaveBeenCalled();
        });

        // Other test cases for addEvent function
    });

    describe("deleteEvent", () => {
        it("should return 403 if userId is not provided in request", async () => {
            // Setting userId to undefined in the request
            req.userId = undefined;

            await eventsController.deleteEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ "message": "Unauthorized or not an organizer" });
            expect(errorLogger.error).toHaveBeenCalled();
        });

        // Other test cases for deleteEvent function
    });

    // Add similar describe blocks for other functions (getEvents, getEventById, applyToEvent, updateEvent)
});
