const { usersController } = require('../controllers/usersController'); 
const User = require('../models/users');
jest.mock('../models/users');

describe('getUsers', () => {
  it('should return all users', async () => {
    User.find.mockResolvedValue([{ name: 'John Doe' }]);
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows for chaining
    };

    await usersController.getUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'John Doe' }]);
  });
});
describe('getUserDetails', () => {
    it('should return user details', async () => {
      User.findOne.mockResolvedValue({ name: 'John Doe', _id: '1' });
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await usersController.getUserDetails(req, res);
      expect(res.json).toHaveBeenCalledWith({ name: 'John Doe', _id: '1' });
    });
  });
  
  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      User.deleteOne.mockResolvedValue({ deletedCount: 1 });
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await usersController.deleteUser(req, res);
      expect(res.json).toHaveBeenCalledWith({ "message": 'Deleting user no:1 is successfully' });
    });
  });
  
  jest.mock('bcryptjs', () => ({
    compare: jest.fn().mockResolvedValue(true),
    hashSync: jest.fn().mockReturnValue('hashedPassword'),
  }));
  
  
  describe('addVolunterEvent', () => {
    it('should add an event to the user\'s volunteer events', async () => {
      // Mock user finding and updating logic
      User.findOne.mockResolvedValue({
        _id: '1',
        volunteerEvents: [],
        save: jest.fn().mockResolvedValue(true),
      });
      User.updateOne.mockResolvedValue({ matchedCount: 1 });
  
      const req = {
        params: { id: '1' },
        body: { eventId: 'event1' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
  
      await usersController.addVolunterEvent(req, res);
      expect(res.json).toHaveBeenCalledWith({ "message": 'Event event1 added to volunteer events successfully' });
    });
  });