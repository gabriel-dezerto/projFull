// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
// TODO (alunos): implementar cada função abaixo.
//
// Fluxo de status:
//   aberto -> em_atendimento -> resolvido
//                           -> cancelado

const db = require('../config/database');

// Todos os status possíveis
const status_validos = ['aberto', 'em andamento', 'resolvido', 'cancelado'];

// GET /chamados - lista chamados
//   admin/técnico -> todos os chamados
//   cliente       -> apenas os seus (WHERE cliente_id = req.usuario.id)
const listar = async (req, res) => {
  
};

// GET /chamados/:id - retorna um chamado pelo ID
const buscarPorId = async (req, res) => {
  // TODO
  res.json({ mensagem: 'buscarPorId - não implementado' });
};

// POST /chamados - abre um novo chamado (cliente/admin)
// Body esperado: { titulo, descricao, equipamento_id, prioridade }
const criar = async (req, res) => {
  // Corpo da requisição
  const { titulo, descricao, equipamento_id, prioridade } = req.body;
  const cliente_id = req.usuario.id;

  // Validação dos campos obrigatórios
  if(!titulo || !descricao || !equipamento_id || !prioridade ){
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Procura o equipamento
    const [equip] = await db.query('SELECT id, status FROM equipamentos WHERE id = ?',
    [equipamento_id]
    );

    // Verifica se o equipamento existe
    if(equip.length === 0){
      return res.status(404).json({ mensagem: 'Equipamento não encontrado.' })
    }

    // Verifica se já existe chamado para ele
    if(equip[0].status === 'em manutencao'){
      return res.status(409).json({ mensagem: 'Equipamento já está em manutenção.' });
    }

    // Inserindo chamado no BD
    const [chamado] = await db.query('INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id) VALUES (?, ?, ?, ?, ?)',
    [titulo, descricao, cliente_id, equipamento_id, prioridade]
    );

    return res.status(201).json({
      mensagem: 'Chamado criado com sucesso!',
      id: chamado.insertId
    });
  } catch (error) {
    console.error('[chamados.criar]', erro);
    return res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};

// PUT /chamados/:id/status - atualiza o status do chamado (técnico/admin)
// Body esperado: { status, tecnico_id (opcional) }
const atualizarStatus = async (req, res) => {
  // TODO: ex: aberto -> em_atendimento -> resolvido
  //       ao resolver, atualizar equipamentos.status para 'operacional'
  res.json({ mensagem: 'atualizarStatus - não implementado' });
};

module.exports = { listar, buscarPorId, criar, atualizarStatus };
