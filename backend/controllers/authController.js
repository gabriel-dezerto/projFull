// =============================================
// CONTROLLER DE AUTENTICAÇÃO
// =============================================
// TODO (alunos): implementar as funções registro e login.
//
// Dicas:
//   - Use bcryptjs para criptografar a senha antes de salvar (registro)
//   - Use bcryptjs para comparar a senha no login (bcrypt.compare)
//   - Use jsonwebtoken (jwt.sign) para gerar o token após login bem-sucedido
//   - O payload do token deve ter: id, nome, email, nivel_acesso
//   - NUNCA coloque a senha no payload do token!

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// POST /auth/registro - cria um novo usuário
const registro = async (req, res) => {

  // Corpo da requisição deve conter: nome, email, senha, nivel_acesso
  const { nome, email, senha, nivel_acesso } = req.body;

  // Validação básica dos campos
  if(!nome || !email || !senha || !nivel_acesso) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verificar se o email já existe
    const [linhas] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    // Se o email já estiver cadastrado, retornar erro
    if (linhas.length > 0) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    // Criptografando a senha antes de salvar no banco
    const senhahash = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário no banco de dados
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
      [nome, email, senhahash, nivel_acesso]
    );

    // Retornar os dados do usuário criado (sem a senha)
    const id = resultado.insertId;
    return res.status(201).json({ 
      mensagem: 'Usuário registrado com sucesso',
      id, nome, email, nivel_acesso });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ mensagem: 'Erro no servidor.' });
  }
};

// POST /auth/login - autentica e retorna JWT
const login = async (req, res) => {

  // Corpo da requisição deve conter: email, senha
  const { email, senha } = req.body;

  // Validação dos campos 
  if(!email || !senha){
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  try {
    // Verifica se o email existe no banco de dados
    const [linhas] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    // Se o email não existir, retorna erro
    if(linhas.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
    }

    // Usuário encontrado, agora verificar a senha
    const usuario = linhas[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    // Caso a senha esteja incorreta, retorna erro
    if(!senhaCorreta){
      return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
    }

    // Gera o token JWT com os dados do usuário (sem a senha)
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel_acesso: usuario.nivel_acesso
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '9h' }
    );

    // Retorna o login do usuário e o token JWT
    return res.status(200).json({
      mensagem: 'Login bem-sucedido',
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro no servidor.' });
  }

};

module.exports = { registro, login };
