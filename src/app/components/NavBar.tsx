import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useAuth, UserButton } from '@clerk/nextjs';
import { useCartStore } from '@/store';

function NavBar () {
    //const useStore = useCartStore();

    return (
        <nav className="fixed top-0 w-full flex items-center py-2 px-8 justify-between z-50 bg-slate-800 text-gray-300">
          <Link 
            href="/" 
            className="uppercase font-bold text-md h-12 flex items-center"
          > 
            PGS Commerce
          </Link>
          <div className="flex items-center gap-8">
            <div className='flex items-center cursor-pointer relative'>
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
            <div>
            <SignedOut>
              {/* Estilizando o botão de login */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Entrar na Conta
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {/* Estilizando o ícone de usuário */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8", // Ajustando o tamanho do ícone do avatar
                    userButtonTrigger: "hover:opacity-80 transition", // Efeito de hover no ícone
                  },
                }}
              />
              
            </SignedIn>
            </div>
            
          </div>
        </nav>
    )
}

export default NavBar;