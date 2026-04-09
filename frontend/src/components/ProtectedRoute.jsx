'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function ProtectedRoute({ children, niveis = [] }){
    const router = useRouter();

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');

        if(!token || !usuario){
            router.push('/login');
            return;
        }

        if(niveis.length > 0){
            const { nivel_acesso } = JSON.parse(usuario);
            if(!niveis.includes(nivel_acesso)){
                router.push('/chamados');
            }
        }
    }, []);
    return children;
}