import { SignUp } from "@clerk/nextjs"

type SignUpPageProps = { 
    searchParams: { 
        redirectUrl: string;
    };
};
export default function SignUpPage({ 
    searchParams: { redirectUrl } }: 
    SignUpPageProps) {
    return (
        <section className="py-14">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center">
                    <SignUp signInUrl="/sign-in" fallbackRedirectUrl={redirectUrl} routing="hash"/>
                </div>
            </div>

        </section>
    )
}