import { ProductType } from "@/types/ProductType";
import Product from "@/app/components/Product";
import Stripe from "stripe";


async function getProducts(): Promise<ProductType[]> {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20'
  });

  const products = await stripe.products.list();
  const formatedProducts = await Promise.all(
    products.data.map(async (product) => {
      const price = await stripe.prices.list({
        product: product.id,
      });
      return {
        id: product.id,
        price: price.data[0].unit_amount,
        name: product.name,
        image: product.images[0],
        description: product.description,
        currency: price.data[0].currency,
      }
    })
  );

  return formatedProducts;
  /** const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) {
    throw new Error('Falha ao buscar os dados');
  }
  return res.json(); **/
}

export default async function Home() {
  const products = await getProducts();

  return (
      <div className='max-w-7xl mx-auto pt-8 px-8 xl:px:0'>
        <div 
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 xl:gap-6
        '
        >
          {products.map((product) => (
            <Product key={product.id} product={product}></Product>
          ))}
        </div>
      </div>
  )
}