"use client"
import { useCartStore } from "@/store"

export default function Cart() {
    const useStore = useCartStore();
    return (
        <>
            <div
                onClick={() => useStore.toggleCart()}
                className='flex items-center cursor-pointer relative'>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="currentColor"
              >
                <path 
                  d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 2h-.01H7zm10-2c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 2h-.01H17zm-13.446-3.326L5.7 5H22V3H5.7l-1.261-3.789A1 1 0 0 0 3.5 0h-2v2h1.719l1.689 5.079L4.655 15h14.472L21 7H6.211l-2.657 7.674z"
                />
              </svg>
              <span 
                className='
                  bg-teal-600 text-sm text-bold rounded-full h-5 w-5 flex items-center justify-center absolute left-3 bottom-3'
              >
                15
              </span>
            </div>
            {!useStore.isOpen && (
                <div onClick={() => useStore.toggleCart()} className="fixed w-full h-screen bg-black/25 left-0 top-0 z-50">
                    <div
                        onClick={(e) => {e.stopPropagation()}}
                        className="absolute bg-slate-600 right-0 top-0 w-1/3 h-screen p-12 overflow-y-scroll"
                    >
                        <h1>Meu Carrinho</h1>
                        {useStore.cart.map((item) => (
                            <div key={item.id}>{item.name}</div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}