'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function RegistroPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        nivel_acesso: 'cliente',
    });
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            await authAPI.registro(form);
            router.push('/login?registrado=true'); // redireciona pro login com aviso de sucesso
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("min-h-screen bg-[#DFF2F9] flex items-center justify-center px-4", inter.className)}>
            <div className="bg-white rounded-2xl border border-blue-100 p-8 w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                    <img src="/logo_techrent.png" alt="TechRent" title="TechRent" className="h-20 dark:invert" />
                </div>

                <h1 className="text-xl font-medium text-blue-900 mb-1">Criar conta</h1>
                <p className="text-sm text-slate-500 mb-6">Preencha os dados para se registrar no sistema</p>

                {/* Erro */}
                {erro && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Nome */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Nome completo</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            placeholder="João Silva"
                            required
                            className="h-10 border border-blue-100 rounded-lg bg-blue-50/50 px-3 text-sm text-blue-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="joao@email.com"
                            required
                            className="h-10 border border-blue-100 rounded-lg bg-blue-50/50 px-3 text-sm text-blue-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        />
                    </div>

                    {/* Senha */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                            className="h-10 border border-blue-100 rounded-lg bg-blue-50/50 px-3 text-sm text-blue-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        />
                    </div>

                    {/* Nível de acesso */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Perfil
                            <span className="ml-2 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5">
                                nível de acesso
                            </span>
                        </label>
                        <select
                            name="nivel_acesso"
                            value={form.nivel_acesso}
                            onChange={handleChange}
                            className="h-10 border border-blue-100 rounded-lg bg-blue-50/50 px-3 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        >
                            <option value="cliente">Cliente</option>
                            <option value="tecnico">Técnico</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 h-10 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {loading ? 'Criando conta...' : 'Criar conta'}
                    </button>

                </form>

                <div className="text-center mt-4 text-sm text-slate-500">
                    Já tem uma conta?{' '}
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-700 font-medium hover:underline"
                    >
                        Entrar
                    </button>
                </div>

            </div>
        </div>
    );
}