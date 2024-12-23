'use client'
import { loadStripe, StripeElementsOptions} from "@stripe/stripe-js"
import { Elements, PaymentElement } from "@stripe/react-stripe-js"
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
    const cartStore = useCartStore();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                itens: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent,
            }),
        }).then((res) => {
            console.log("Resposta da API:", res);
            return res.json();
        }).then((data) => {
            console.log("Dados retornados:", data);
            cartStore.setPaymentIntent(data.paymentIntent.id);
            setClientSecret(data.paymentIntent?.client_secret);
        }).catch((error) => {
            console.log("Erro ao fazer fetch:", error);
        });
    }, [cartStore, cartStore.cart, cartStore.paymentIntent]);
    
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
                        < PaymentElement id="payment-element" options={{ layout: 'tabs' }}/>
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