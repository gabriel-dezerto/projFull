const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = ()=> localStorage.getItem('token');

const request = async (path, options = {})=> {
    const token = getToken();

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers:{
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.mensagem || 'Erro na requisição.');
    }

    return data;
};

// AUTH
export const authAPI ={
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    registro: (body) => request('/auth/registro', { method: 'POST', body: JSON.stringify(body) })
};

// CHAMADOS
export const chamadosAPI={
    listar: () => request('/chamados'),
    buscarPorId: (id) => request(`/chamados/${id}`),
    criar: (body) => request('/chamados', {method: 'POST', body: JSON.stringify(body)}),
    atualizarStatus: (id, body) => request(`/chamados/${id}/status`, {method: 'PUT', body: JSON.stringify(body)})
};

// EQUIPAMENTOS
export const equipamentosAPI={
    listar: () => request('/equipamentos'),
    buscarPorId: (id) => request(`/equipamentos/${id}`),
    criar: (body) => request('/equipamentos', {method: 'POST', body: JSON.stringify(body)}),
    atualizar: (id, body) => request(`/equipamentos/${id}`, {method: 'PUT', body: JSON.stringify(body)}),
    remover: (id, body) => request(`/equipamentos/${id}`, {method: 'DELETE', body: JSON.stringify(body)})
};

// MANUTENÇÃO
export const manutencaoAPI={
    listar: () => request('/manutencao'),
    criar: (body) => request('/manutencao', {method: 'POST', body: JSON.stringify(body)})
}

// DASHBOARD
export const dashboardAPI={
    resumoAdmin: () => request('/dashboard/admin'),
    painelTecnico: () => request('/dashboard/tecnico')
}