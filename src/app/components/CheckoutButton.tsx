'use client'
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type CheckoutButtonProps = { 
    totalPrice: number;
    onCheckout: () => void;
}
export default function CheckoutButton({ totalPrice }: CheckoutButtonProps) {
    const router = useRouter();
    const { user } = useUser();
    const cartStore = useCartStore();

    const handleCheckout = async () => {
        if (!user) {
          // Se o usuário não estiver logado, redireciona para o login
          router.push("/sign-in");
          return;
        }
        
        // Se o usuário estiver logado, então proceda para o checkout
        cartStore.setCheckout("checkout");
      };
    return (
        <div>
            <p className="text-teal-600 font-bold">Total: {formatPrice(totalPrice)} </p>
            <button onClick={handleCheckout} className="w-full rounded-md bg-teal-600 text-white py-2 mt-2">
                Finalizar Compra
            </button>
        </div>
    )
} 