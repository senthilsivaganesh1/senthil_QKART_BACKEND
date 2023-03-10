const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
 const getUserById = async (id) => {
      const result = await User.findOne({"_id":id});
      console.log(result,"userById")
      return result;

  }; 


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
 const getUserByEmail = async (email) => {
    try {
      const result = await User.findOne({ email });
      return result;
    } catch (error) {
      throw error;
    }
  }; 

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
 const createUser = async (user) => {
    if(await User.isEmailTaken(user.email)){

        
        throw new ApiError(httpStatus.OK, "\"\"userId\"\" must be a valid mongo id")

    }
    if(!user.email){
      throw new ApiError(httpStatus.BAD_REQUEST, "\"\"email\"\" email is required")
    }
    if(!user.name){
      throw new ApiError(httpStatus.BAD_REQUEST, "\"\"name\"\" name is required")
    }
    if(!user.password){
      throw new ApiError(httpStatus.BAD_REQUEST, "\"\"password\"\" password is required")
    }
    // const { name, email, password } = user;
    // try {
    //     const { name, email, password } = user;
    //   const newUser = new User({ name, email, password });
    //   const result = await newUser.save();
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
    const Createduser = await User.create({...user});
    return Createduser
  };

  module.exports = {
    getUserById,
    getUserByEmail,
    createUser
  };
  

