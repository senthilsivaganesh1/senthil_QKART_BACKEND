const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const result = await Cart.findOne({"email":user.email});
  // console.log(result,"result123")
  if(!result){
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return result;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {

  const productTobeAdded = await Product.findById(productId);
  if(!productTobeAdded){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }
  
  let userCart = await Cart.findOne({"email":user.email});  
  // let productTobeAdded;
  if(userCart){
    const productInCart = userCart.cartItems.find((cart)=>{return (cart.product._id == productId)});
    if(productInCart){
      throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart");
    }
    userCart.cartItems = [{product:productTobeAdded,quantity:quantity}];  
    // userCart = await Cart.create(userCart);  
    return await userCart.save();

  }else{
    const cartItem = {};
    // cartItem._id = user._id;
    cartItem.email = user.email;
    cartItem.cartItems = [{product:productTobeAdded,quantity:quantity}];   
    const newCart =  await Cart.create(cartItem);   
    if(!newCart){
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cart creation failed");
    }
    // await cartItem.save();
    // await userCart.save();
  }
  // return userCart;
  

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  // console.log('updateProductInCart..',user)
  const userCart = await Cart.findOne({"email":user.email});
  
  if(!userCart){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product");
  }
  const productTobeAdded = await Product.findById(productId);
  if(!productTobeAdded){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }
  const productInCart = userCart.cartItems.find((cart)=>{return (cart.product._id == productId)});
    if(!productInCart){
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
    }
    userCart.cartItems = [{product:productTobeAdded,quantity:quantity}];  
    // userCart = await Cart.create(userCart); 
    const updatedCart = await userCart.save();
    
    return updatedCart;

};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
// const deleteProductFromCart = async (user, productId) => {
//   const userCart = await Cart.findOne({"email":user.email});
//   if(!userCart){
//     throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
//   }
//   const productInCart = userCart.cartItems.find((cart)=>{return (cart.product._id == productId)});
//   if(!productInCart){
//     throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
//   }
//   await userCart.deleteOne({ _id: userCart._id });
//   const updatedCart = await userCart.save();
//   return updatedCart;
// };



// const deleteProductFromCart = async (user, productId) => {
//   const cart = await Cart.findOne({ email: user.email });
//   let indexOfProductToUpdate = -1;
//   if (!cart) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "user does not have a cart");
//   }
//   console.log('cart..',cart)
//   console.log('productId',productId)
//   console.log('cartItems.product',cart.cartItems[0].product._id);

//    indexOfProductToUpdate = cart.cartItems.findIndex(
//     (item) => item.product._id == productId
//   );
//   console.log('indexOfProductToUpdate',indexOfProductToUpdate);

//   if (indexOfProductToUpdate === -1) {
//     throw new ApiError(httpStatus.BAD_REQUEST, " Product not present in cart ");
//   }

//   //cart.cartItems = cart.cartItems.filter(item => item.product._id !== productId);
//   cart.cartItems.splice(indexOfProductToUpdate, 1);
//   console.log('Aftercart..',cart)

//   const newCart = await cart.save();
//   // return newCart;
// };
const deleteProductFromCart = async (user, productId) => {
  // CRIO_SOLUTION_START_MODULE_CART
  let cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }

  // Find the index of the cart item matching the input productId
  let productIndex = -1;
  for (let i = 0; i < cart.cartItems.length; i++) {
    if (productId == cart.cartItems[i].product._id) {
      productIndex = i;
    }
  }

  // If product not in cart, throw error. Otherwise, delete from cart.
  if (productIndex == -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart. ");
  } else {
    cart.cartItems.splice(productIndex, 1);
  }

  await cart.save();
};

// const deleteProductFromCart = async (user, productId) => {
// };

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  // let cart = await Cart.findOne({ email: user.email });
  // if (!cart || cart==null) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  // }
  // // let productIndex = -1;
  // // for (let i = 0; i < cart.cartItems.length; i++) {
  // //   if (productId == cart.cartItems[i].product._id) {
  // //     productIndex = i;
  // //   }
  // // }

  // // If product not in cart, throw error. Otherwise, delete from cart.
  // if (cart.cartItems.length==0) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "No Product in cart. ");
  // }

  // if(!user.hasSetNonDefaultAddress){
  //   throw new ApiError(httpStatus.BAD_REQUEST, "No default address set");
  // }
  // if(user.walletMoney == 0 ){
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  // }
  // // TODO - Test4
  // let total = 0;
  // for (let i = 0; i < cart.cartItems.length; i++) {
  //   total += cart.cartItems[i].product.cost * cart.cartItems[i].quantity;
  // }

  // // if (total > user.walletMoney) {
  // //   throw new ApiError(
  // //     httpStatus.BAD_REQUEST,
  // //     "User has insufficient money to process"
  // //   );
  // // }

  // // TODO - Test 5
  // user.walletMoney -= total;
  // await user.save();

  // cart.cartItems = [];
  // await cart.save();
  // TODO - Test1

  // TODO - Test1

  let cart = await Cart.findOne({ email: user.email });
  
  if (cart==null) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  
  // TODO - Test2
  
  if (cart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }
 
  
  // TODO - Test3
  
  let hasSetNonDefaultAddress = await user.hasSetNonDefaultAddress();
 
  if (!hasSetNonDefaultAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  }
  
  // if (user.address == config.default_address) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  // }

  // TODO - Test4
  let total = 0;
  for (let i = 0; i < cart.cartItems.length; i++) {
    total += cart.cartItems[i].product.cost * cart.cartItems[i].quantity;
  }

  if (total > user.walletMoney) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User has insufficient money to process"
    );
  }

  // TODO - Test 5
  user.walletMoney -= total;
  await user.save();

  cart.cartItems = [];
  await cart.save();
  
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
