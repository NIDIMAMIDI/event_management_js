import { createToken } from '../../helpers/jwt/jwt.token.helpers.js';
import { User } from '../../models/user/user.model.js';
import { hashPassword, passwordChecking } from '../../helpers/bcrypt/bcrypt.helpers.js';
import { userCreate } from '../../helpers/user/user.helpers.js';

// ============================   Registration Functionality   ============================================

export const userRegister = async (req, res, next) => {
  try {
    // Fetching validated data from the authValidator file
    const { username, email, password } = req.body;

    // Convert the email to lowercase for consistency
    const loweredEmail = email.toLowerCase();

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: loweredEmail });
    if (existingUser) {
      return res.status(404).json({
        status: 'failure',
        message: `User with email ${loweredEmail} already exists`
      });
    }

    // Hash the password with bcrypt (use 12 salt rounds)
    const hashedPassword = await hashPassword(password, 12);

    // Create a new user in the database
    const newUser = await userCreate(User, username, loweredEmail, hashedPassword);

    // Create a JWT token and get cookie options
    const { token, cookieOptions } = createToken(newUser);

    // Store the generated token in the User model
    await User.findByIdAndUpdate(newUser._id, { token: token });

    const user = await User.findById(newUser._id);

    // Set the token as a cookie in the response
    res.cookie('jwt', token, cookieOptions);

    // Send a success response with the newly created user and token
    res.status(201).json({
      status: 'success',
      message: `${newUser.username}'s registration successfull`,
      userDetails: {
        user
      }
    });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({
      status: 'failure',
      message: error.message
    });
  }
};

// ============================   Login Functionality   ============================================

export const userLogin = async (req, res, next) => {
  try {
    // fetching validated data from the authValidator
    const { email, password } = req.body;

    // converting email to a lowerCase
    const loweredEmail = email.toLowerCase();

    // check if user email exists in database
    const user = await User.findOne({ email: loweredEmail });

    // if user does not found with the provided mail it will give error response
    if (!user) {
      return res.status(500).json({
        status: 'failure',
        message: `User with ${email} doesn't exists`
      });
    }

    // check if password is correct or not
    const isPAsswordCorrect = await passwordChecking(password, user.password);

    // if provided password does not match stored password it will throw the error response
    if (!isPAsswordCorrect) {
      return res.status(500).json({
        status: 'failure',
        message: 'Invalid Password'
      });
    }

    // fetching jwt token and cookie options
    const { token, cookieOptions } = createToken(user);

    // Store the generated token in the User model
    await User.findByIdAndUpdate(user._id, { token: token });

    const userToken = await User.findById(user._id);

    // setting token as a cookie
    res.cookie('jwt', token, cookieOptions);

    const { password: pwd, createdAt, updatedAt, ...other } = userToken._doc;

    // success response
    res.status(200).json({
      status: 'success',
      message: `User ${user.username}'s Login Successfull`,
      userDetails: {
        other
      }
    });
  } catch (err) {
    // error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
