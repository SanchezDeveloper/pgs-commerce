'use client'
import { loadStripe, StripeElementsOptions} from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { error } from "console";



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
    const cartStore = useCartStore();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        fetch('./api/create-payment-intent', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                items: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent,
            }),
         })
            .then((response) => { return response.json() })
            .then((data) => {
                cartStore.setPaymentIntent(data.paymentIntent.id);
                setClientSecret(data.paymentIntent?.client_secret);
            })
            .catch((error) => console.error("Erro na requisição", error));
    }, [cartStore, cartStore.cart, cartStore.paymentIntent]);
    
    console.log("CartStore:", cartStore.cart);
    console.log("PaymentIntent:", cartStore.paymentIntent);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'night',
            labels: 'floating'
        }
    }

    return ( 
        <div>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm clientSecret={clientSecret}/> 
                    </Elements>              
                ) : (
                    <div>
                        <h1>Carregando...</h1>
                    </div>
                )
            }
            
        </div>
    );
}

