import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useAuth, UserButton } from '@clerk/nextjs';
import Cart from './Cart';

function NavBar () {
    

    return (
        <nav className="fixed top-0 w-full flex items-center py-2 px-8 justify-between z-50 bg-slate-800 text-gray-300">
          <Link 
            href="/" 
            className="uppercase font-bold text-md h-12 flex items-center"
          > 
            PGS Commerce
          </Link>
          <div className="flex items-center gap-8">
            <Cart />
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