import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    router.push(token ? '/dashboard' : '/login');
  }, []);
  
  return null;
}
