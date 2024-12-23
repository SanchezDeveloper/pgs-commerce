// 'use client'
// import { loadStripe, StripeElementsOptions} from "@stripe/stripe-js"
// import { Elements, PaymentElement } from "@stripe/react-stripe-js"
// import { useCartStore } from "@/store";
// import { useEffect, useState } from "react";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export default function Checkout() {
//     const cartStore = useCartStore();
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         fetch('/api/create-payment-intent', {
//             method: 'POST',
//             headers: { 
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ 
//                 items: cartStore.cart,
//                 payment_intent_id: cartStore.paymentIntent,
//             }),
//         }).then((res) => {
//             console.log("Resposta da API:", res);
//             return res.json();
//         }).then((data) => {
//             console.log("Dados retornados:", data);
//             cartStore.setPaymentIntent(data.paymentIntent.id);
//             setClientSecret(data.paymentIntent?.client_secret);
//         }).catch((error) => {
//             console.error("Erro ao fazer fetch:", error);
//         });
//     }, [cartStore, cartStore.cart, cartStore.paymentIntent]);
    
//     const options: StripeElementsOptions = {
//         clientSecret,
//         appearance: {
//             theme: 'night',
//             labels: 'floating'
//         }
//     }

//     return ( 
//         <div>
//             {
//                 clientSecret ? (
//                     <Elements options={options} stripe={stripePromise}>
//                         < PaymentElement id="payment-element" options={{ layout: 'tabs' }}/>
//                     </Elements>
                    
                    
//                 ) : (
//                     <div>
//                         <h1>Carregando...</h1>
//                     </div>
//                 )
//             }
            
//         </div>
//     );
// }

'use client'
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
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
                items: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent,
            }),
        })
        .then((res) => {
            // Primeiro, obtém a resposta como texto
            return res.text();
        })
        .then((responseText) => {
            console.log("Resposta da API:", responseText);
            try {
                // Tenta converter o texto para JSON
                const data = JSON.parse(responseText);
                console.log("Dados retornados:", data);

                // Verifica se os dados possuem a estrutura esperada
                if (data.paymentIntent) {
                    cartStore.setPaymentIntent(data.paymentIntent.id);
                    setClientSecret(data.paymentIntent?.client_secret);
                } else {
                    console.error("Dados do paymentIntent não encontrados.");
                }
            } catch (error) {
                console.error("Erro ao processar a resposta JSON:", error);
            }
        })
        .catch((error) => {
            console.error("Erro ao fazer fetch:", error);
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
