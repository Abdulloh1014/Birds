// for ADMIN

import express from "express";
import founderController from "./controllers/founder_controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";


const routerAdmin = express.Router();

/** Restaurant Admin pagelari **/
routerAdmin.get("/", founderController.goHome);

routerAdmin
  .get("/login", founderController.getLogin)
  .post("/login", founderController.processLogin);


routerAdmin
  .get("/signup", founderController.getSignup)
  .post("/signup", 
   founderController.processSignup);


  routerAdmin.get("/logout", founderController.logout);
  routerAdmin.get("/check-me", founderController.checkAuthSession);

  /** Product */

routerAdmin.get("/product/all", 
  founderController.verifyRestaurant,    
  productController.getAllProducts);

routerAdmin.post("/product/create", 
  founderController.verifyRestaurant, 
  // uploadProductImage.single('productImage'),
  makeUploader("products").array("productImages", 5,),
  productController.createNewProduct);

routerAdmin.post("/product/:id", 
  founderController.verifyRestaurant,
  productController.updateChosenProduct);



/** User */

routerAdmin.get("/user/all", 
  founderController.verifyRestaurant, 
  founderController.getUsers
);

routerAdmin.post("/user/edit", 
  founderController.verifyRestaurant, 
  founderController.updateChosenUser
);






export default routerAdmin;
