import passport from "passport";
import express from "express";
import ProductController from "../app/controllers/ProductController";

var router = express.Router();

/**GET ALL TODOS ROUTE */
router.get(
	"/products",
	passport.authenticate("jwt", { session: false }),
	ProductController.index
);
/**CREATE A TODOS ROUTE */
router.post(
	"/products/create",
	passport.authenticate("jwt", { session: false }),
	ProductController.create
);
/**GET A TODOS ROUTE */
router.get(
	"/products/:product",
	passport.authenticate("jwt", { session: false }),
	ProductController.show
);
/**UPDATE A TODOS ROUTE */
router.put(
	"/products/:product",
	passport.authenticate("jwt", { session: false }),
	ProductController.update
);
/**DELETE A TODOS ROUTE */
router.delete(
	"/products/:product",
	passport.authenticate("jwt", { session: false }),
	ProductController.delete
);

export default router;
