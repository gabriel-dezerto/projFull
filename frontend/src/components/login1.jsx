import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  signupUrl = "/src/app/registro/page.jsx",
  className
}) => {
  return (
    <section className={cn("h-screen bg-muted", className)}>
      <div className="flex h-full items-center justify-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 lg:justify-start">
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-30 dark:invert" />
          <div
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <Input type="email" placeholder="Email" className="text-sm" required />
            <Input type="password" placeholder="Password" className="text-sm" required />
            <Button type="submit" className="w-full">
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
