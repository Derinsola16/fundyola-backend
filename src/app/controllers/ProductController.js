import Product from "../models/Products";
import { NHttpStatuses } from "http-response-status";
import User from "../models/User";
import { mongoose } from "mongoose";

class ProductController {
  async index(req, res, next) {
    try {
      const result = await Product.find();
      const products = _(result);
      const data = products.map((product) =>
        Product.responseFormatter(product)
      );
      res.status(NHttpStatuses.ESuccess.OK).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      // validate request
      let validation = validator(req.body, {
        name: "required|string",
        description: "required|string",
        category: "required|string",
        oldPrice: "string",
        price: "required|string",
        image: "required|string",
      });

      async function passes() {
        try {
          const product = new Product();

          product.name = req.body.name;
          product.description = req.body.description;
          product.category = req.body.category;
          product.oldPrice = req.body.oldPrice;
          product.price = req.body.price;
          product.image = req.body.image;

          if (!(await product.save())) {
            throw new HttpException("Oops! Something went wrong.", 500);
          }

          return res
            .status(NHttpStatuses.ESuccess.OK)
            .json(Product.responseFormatter(product));
        } catch (error) {
          next(error);
        }
      }

      function fails() {
        return res
          .status(NHttpStatuses.EClientError.UNPROCESSABLE_ENTITY)
          .json({
            message: "The given data is invalid",
            errors: validation.errors.all(),
          });
      }

      validation.checkAsync(passes, fails);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const product = await Product.findOne({
        _id: req.params.product,
      });

      if (_.isNull(product)) {
        throw new HttpException(
          "Sorry, we can't find what you are looking for",
          404
        );
      }

      return res.status(NHttpStatuses.ESuccess.OK).json({
        data: Product.responseFormatter(product),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      let product = await Product.findOne({
        _id: req.params.product,
      });

      if (_.isNull(product)) {
        throw new HttpException(
          "Sorry, we can't find what are looking for",
          404
        );
      }

      // validate request
      let validation = validator(req.body, {
        name: `required|string`,
        description: `required|string`,
        category: `required|string`,
        oldPrice: `string`,
        price: `required|string`,
        image: `required|string`,
      });

      async function passes() {
        try {
          product.name = req.body.name;
          product.description = req.body.description;
          product.category = req.body.category;
          product.oldPrice = req.body.oldPrice;
          product.price = req.body.price;
          product.image = req.body.image;

          if (!(await product.save())) {
            throw new HttpException("Oops! Something went wrong.", 500);
          }

          return res
            .status(NHttpStatuses.ESuccess.OK)
            .json(Product.responseFormatter(product));
        } catch (error) {
          next(error);
        }
      }

      function fails() {
        return res
          .status(NHttpStatuses.EClientError.UNPROCESSABLE_ENTITY)
          .json({
            message: "The given data is invalid",
            errors: validation.errors.all(),
          });
      }

      validation.checkAsync(passes, fails);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const product = await Product.findOne({
        _id: req.params.product,
      });

      if (_.isNull(product)) {
        throw new HttpException(
          "Sorry, we can't find what you are looking for",
          404
        );
      }

      if (!(await product.delete())) {
        throw new HttpException("Oops! Something went wrong.", 500);
      }

      return res.status(NHttpStatuses.ESuccess.NO_CONTENT).json("Product deleted");
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
