const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  let payload = {
    sub: userId,
    type: type,
    iat: Math.floor(Date.now()/1000),
    exp:expires        
}
// let tokenExpiry = {expiresIn: expires}
  const token = jwt.sign(payload, secret);
  return token;
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  // return new Promise(function (resolve, reject) {
    var result = {};
    //generating acess token
    const accessTokenExpiry = Math.floor(Date.now()/1000) + config.jwt.accessExpirationMinutes * 60;
    const token = await generateToken(user._id, accessTokenExpiry, tokenTypes.ACCESS);  

    // result[tokenTypes.ACCESS].token = token;  
    

   
    // result[tokenTypes.ACCESS].expires = new Date(accessTokenExpires*1000);
    // access.expires = s;
    // return result;

    return {
      [tokenTypes.ACCESS]: {
        token: token,
        expires: new Date(accessTokenExpiry * 1000), // miliseconds
      },
    }
    
    // resolve(result);
    // })
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
