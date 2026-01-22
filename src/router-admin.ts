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

  founderController.verifyFounder,    
  productController.getAllProducts);



routerAdmin.post("/product/delete/:id",
  founderController.verifyFounder,
  productController.deleteProduct
);
  
routerAdmin.post("/product/update/:id",
  founderController.verifyFounder,
  makeUploader("products").array("productImages", 5),
  productController.updateProduct
);
  

routerAdmin.post("/product/create", 
  founderController.verifyFounder, 
  makeUploader("products").array("productImages", 5,),
  productController.createNewProduct);

routerAdmin.post("/product/:id", 
  founderController.verifyFounder,
  productController.updateChosenProduct);



/** User */

routerAdmin.get("/user/all", 
  founderController.verifyFounder, 
  founderController.getUsers
);

routerAdmin.post("/user/edit", 
  founderController.verifyFounder, 
  founderController.updateChosenUser
);






export default routerAdmin;
