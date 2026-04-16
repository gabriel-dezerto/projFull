'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Inter, JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const Login1 = ({

  heading = "Login",

  logo = {
    url: "",
    src: "/logo_techrent.png",
    alt: "logo",
    title: "TechRent",
  },

  buttonText = "Login",
  signupText = "Não tem uma conta?",
  signupUrl = "/registro",
  className
}) => {

  const router = useRouter();

  return (
    <section className={cn("h-screen bg-muted", inter.className, className) } >
      <div className="flex h-full items-center justify-center bg-[#DFF2F9]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-40 dark:invert" />
          <div
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-bold">{heading}</h1>}
            <Input type="email" placeholder="Email" className="text-sm focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]" required />
            <Input type="password" placeholder="Senha" className="text-sm focus-visible:ring-[#3078AA]/40 focus-visible:border-[#3078AA]" required />
            <Button type="submit" className="w-full bg-[#3078AA]" onClick={() => router.push("/src/app/dashboard/page.jsx")}>
              {buttonText}
            </Button>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <a href={signupUrl} className="font-medium text-primary hover:underline">
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
