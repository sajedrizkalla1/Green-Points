const { authController } = require('../controllers/authController');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Mock the response object
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

// Mock User model methods
jest.mock('../models/users');

// Mock bcrypt.hashSync
bcrypt.hashSync = jest.fn();

// Mock nodemailer.createTransport
nodemailer.createTransport = jest.fn(() => ({
    sendMail: jest.fn(),
}));

// Mock jwt.sign
jwt.sign = jest.fn();

describe('authController', () => {
    describe('signup', () => {
        test('should create a new user', async () => {
            // Mock the request body
            const req = {
                body: {
                }
            };
    
            // Mock the response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the signup function with the mocked req and res
            await authController.signup(req, res);
        });
    });
    
    });

    describe('login', () => {
        test('should login the user with correct credentials', async () => {
            // Mock the request body
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password' // Provide the correct password for the test user
                }
            };
    
            // Mock the user object returned by findOne
            const mockUser = {
                _id: 'testUserId', // Provide the user's ID
                name: 'Test User',
                email: 'test@example.com',
            };
    
            // Mock the User.findOne function to return the mockUser object
            User.findOne = jest.fn().mockResolvedValue(mockUser);
    
            // Mock the response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the login function with the mocked req and res
            await authController.login(req, res);
        });
    
    });
    describe('forgetPassword', () => {
        test('should send a password reset email', async () => {
            // Mock the request body
            const req = {
                body: {
                    email: 'test@example.com' // Provide the email for which to send the password reset email
                }
            };
    
            // Mock the user object returned by findOne
            const mockUser = {
                _id: 'testUserId', // Provide the user's ID
                email: 'test@example.com'
            };
    
            // Mock the User.findOne function to return the mockUser object
            User.findOne = jest.fn().mockResolvedValue(mockUser);
    
            // Mock the transporter.sendMail function
            nodemailer.createTransport().sendMail = jest.fn((mailOptions, callback) => {
                // Simulate successful email sending
                callback(null, 'Email sent');
            });
    
            // Mock the response object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Call the forgetPassword function with the mocked req and res
            await authController.forgetPassword(req, res);
        });
    
    });
    describe('resetPassword', () => {
        test('should reset the user\'s password', async () => {
            // Mock the request body
            const req = {
                body: {
                    email: 'test@example.com', // Provide the email for which to reset the password
                    otp: 'testOTP', // Provide the OTP for resetting the password
                    newPassword: 'newPassword' // Provide the new password
                }
            };
    
            // Mock the user object returned by findOne
            const mockUser = {
                _id: 'testUserId', // Provide the user's ID
                email: 'test@example.com',
                resetPasswordToken: 'testOTP', // Match the provided OTP
                resetPasswordExpires: Date.now() + 15 * 60 * 1000, // Set the expiration time to a future time
                password: 'oldPassword' // Provide the current hashed password
            };
    
            // Mock the User.findOne function to return the mockUser object
            User.findOne = jest.fn().mockResolvedValue(mockUser);
    
            // Mock the user.save function
            mockUser.save = jest.fn().mockResolvedValue();
    
            // Mock the response object
            const res = {
                json: jest.fn()
            };
    
            // Call the resetPassword function with the mocked req and res
            await authController.resetPassword(req, res);
        });
    
    });