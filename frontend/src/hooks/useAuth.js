'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { authAPI } from "@/lib/api"

export function useAuth() {
    const [usuario, setUsuario] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const dados = localStorage.getItem('dados');

        if(token && dados){
            setUsuario(JSON.parse(dados));
        }
    }, []);

    const login = async(email, senha) =>{
        const data = await authAPI.login(email, senha);

        localStorage.setItem('token', data.token);

        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('usuario', JSON.stringify(payload));
        setUsuario(payload);

        // Redireciona para a dashboard de acordo com o nivel de acesso
        // ADMIN
        if(payload.nivel_acesso === 'admin'){
            return router.push('/dashboard');
        }

        // TECNICO
        if(payload.nivel_acesso === 'tecnico'){
            return router.push('/dashboard');
        }

        // USUARIO
        if(payload.nivel_acesso === 'usuario'){
            return router.push('/chamados');
        }
    };

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
        router.push('/login');
    };

    return { usuario, login, logout };
}