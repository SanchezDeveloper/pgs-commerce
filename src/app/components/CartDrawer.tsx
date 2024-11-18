import { useCartStore } from "@/store";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import CheckoutButton from "./CheckoutButton";
import Checkout from "./Checkout";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CartDrawer() {
  const useStore = useCartStore();
  const router = useRouter();
  const { isSignedIn } = useAuth(); // Clerk Auth hook

  const totalPrice = useStore.cart.reduce((acc, item) => {
    return acc + item.price! * item.quantity!;
  }, 0);

  useEffect(() => {
    console.log("onCheckout dentro do useEffect: ", useStore.onCheckout); // Verificando o valor
    if (useStore.onCheckout === "checkout" && !isSignedIn) {
      // Se o usuário não estiver logado, redireciona para a página de login
      useStore.setCheckout("cart"); // Resetando checkout
      router.push("/sign-in");
    }
  }, [useStore.onCheckout, isSignedIn, router]);
  
  const handleCheckout = () => {
    console.log("Botão de Finalizar Compra clicado!"); // Verificando se o clique acontece
    if (!isSignedIn) {
      // Se o usuário não estiver logado, redireciona para login
      router.push("/sign-in");
      return;
    }
  
    if (useStore.cart.length > 0) {
      // Se o usuário estiver logado, vai para o checkout
      useStore.proceedToCheckout();
    }
  };
  
  return (
    <div
      onClick={() => useStore.toggleCart()}
      className="fixed w-full h-screen bg-black/25 left-0 top-0 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bg-slate-600 right-0 top-0 w-1/3 h-screen p-8 overflow-y-scroll"
      >
        <button
          onClick={() => useStore.toggleCart()}
          className="font-bold text-sm text-teal-600"
        >
          Voltar para loja
        </button>
        <div className="border-t border-gray-400 my-4"></div>

        {useStore.onCheckout === "cart" && (
          <>
            {useStore.cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw 33vw"
                  className="object-cover w-24"
                  priority
                />

                <div>
                  <h2 className="w-42 truncate">{item.name}</h2>
                  <h2>Quantidade: {item.quantity}</h2>
                  <p className="text-teal-600 text-sm font-bold">
                    {formatPrice(item.price)}
                  </p>
                  <button
                    className="py-1 px-2 border rounded-md mt-2 text-sm mr-1"
                    onClick={() => {
                      useStore.addProduct(item);
                    }}
                  >
                    Adicionar
                  </button>
                  <button
                    className="py-1 px-2 border rounded-md mt-2 text-sm"
                    onClick={() => useStore.removeProduct(item)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            {useStore.cart.length === 0 && (
              <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
            )}
          </>
        )}

        {useStore.cart.length > 0 && useStore.onCheckout === "cart" && (
          <CheckoutButton totalPrice={totalPrice} onCheckout={handleCheckout} />
        )}

        {/* Renderiza o componente Checkout somente se o estado for 'checkout' */}
        {useStore.onCheckout === "checkout" && isSignedIn && <Checkout />}
      </div>
    </div>
  );
}
