import Model from "../../database/ProductSchema";

class Product extends Model {}

Product.responseFormatter = (product) => {
	const obj = {
		id: product.id,
		name: product.title,
    image: product.image,
    category: product.category,
		description: product.description,
    oldPrice: product.oldPrice,
    price: product.price,
	};

	return obj;
};

export default Product;
