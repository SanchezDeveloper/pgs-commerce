import { SignIn } from "@clerk/nextjs"

type SignInPageProps = { 
    searchParams: { 
        redirectUrl: string;
    };
};
export default function SignInPage({ searchParams: { redirectUrl } }: SignInPageProps) {
    return (
        <section className="py-14">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center">
                    <SignIn signUpUrl="/sign-up" fallbackRedirectUrl={redirectUrl} routing="hash"/>
                </div>
            </div>

        </section>
    )
}