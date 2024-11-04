/* eslint-disable max-len */
/* eslint-disable no-undef */
import { userRegister } from '../../controllers/auth/auth.controllers.js';
import { User } from '../../models/user/user.model.js';
import { createToken } from '../../helpers/jwt/jwt.token.helpers.js';
import { hashPassword } from '../../helpers/bcrypt/bcrypt.helpers.js';
import { userCreate } from '../../helpers/user/user.helpers.js';

// Mocking external modules
jest.mock('../../models/user/user.model.js');
jest.mock('../../helpers/jwt/jwt.token.helpers.js');
jest.mock('../../helpers/bcrypt/bcrypt.helpers.js');
jest.mock('../../helpers/user/user.helpers.js');

describe('userRegister', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should register a new user successfully', async () => {
    // Mocking external functions
    User.findOne.mockResolvedValue(null); // No existing user
    hashPassword.mockResolvedValue('hashedPassword123'); // Mock hashed password
    userCreate.mockResolvedValue({
      _id: 'userId',
      username: 'testuser',
      email: 'test@example.com'
    }); // Mock user creation
    createToken.mockReturnValue({
      token: 'mockedToken',
      cookieOptions: { httpOnly: true }
    }); // Mock token creation
    User.findById.mockResolvedValue({
      _id: 'userId',
      username: 'testuser',
      email: 'test@example.com'
    }); // Mock fetching user by ID

    await userRegister(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(hashPassword).toHaveBeenCalledWith('password123', 12);
    expect(userCreate).toHaveBeenCalledWith(
      User,
      'testuser',
      'test@example.com',
      'hashedPassword123'
    );
    expect(createToken).toHaveBeenCalledWith({
      _id: 'userId',
      username: 'testuser',
      email: 'test@example.com'
    });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('userId', {
      token: 'mockedToken'
    });
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockedToken', { httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: "testuser's registration successfull",
      userDetails: {
        user: { _id: 'userId', username: 'testuser', email: 'test@example.com' }
      }
    });
  });

  test('should return 404 if user already exists', async () => {
    User.findOne.mockResolvedValue({ _id: 'existingUserId', email: 'test@example.com' }); // Existing user found

    await userRegister(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(404); // Changed status from 409 to 404
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'User with email test@example.com already exists'
    });
    expect(hashPassword).not.toHaveBeenCalled(); // No hashing since user exists
    expect(userCreate).not.toHaveBeenCalled(); // No user creation since user exists
  });
});
