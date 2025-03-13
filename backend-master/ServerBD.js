const express = require('express');
const cors = require('cors');
const { Usuario, Agendamento, Servico, VwAgendamentos, sequelize } = require('./bd'); // Ajuste o caminho conforme necessário

const app = express();
const port = 3000; // Ajuste a porta conforme necessário

app.use(cors()); // Habilita CORS
app.use(express.json()); // Faz o parsing do JSON no corpo das requisições

// ---------------------- ROTAS PARA USUÁRIOS ----------------------
// Rota de login
app.post('/usuarios/login', async (req, res) => {
  console.log('Requisição recebida:', req.body); // Log para verificar os dados recebidos

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    res.json({
      message: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
      },
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao tentar realizar o login.' });
  }
});
// Rota para obter todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll(); // Busca todos os usuários
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});
// Rota para obter um usuário por ID
app.get('/usuario/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id); // Busca um usuário pelo ID
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});
// Rota para criar um novo usuário
app.post('/usuario/inserir', async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body); // Cria um novo usuário
    console.log('Recebendo dados:', req.body); // Adicione este log
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir usuário.' });
  }
});
// Rota para atualizar usuário
app.put('/usuarios/atualizar/:id', async (req, res) => {
  console.log('Requisição recebida para atualizar dados do usuário:', req.body); // Log para verificar os dados recebidos

  const { nome, email, senha, tipoUsuario } = req.body; // Inclui tipoUsuario
  const { id } = req.params; // Pegando o ID do usuário a ser atualizado da URL

  // Verifica se todos os campos necessários foram fornecidos
  if (!nome || !email || !senha || typeof tipoUsuario === 'undefined') { // tipoUsuario não pode ser undefined
    return res.status(400).json({ error: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
  }

  try {
    // Encontrar o usuário pelo ID
    const usuario = await Usuario.findOne({ where: { id } });

    // Se o usuário não for encontrado
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Atualizar os dados do usuário
    usuario.nome = nome.trim();
    usuario.email = email.trim();
    usuario.senha = senha.trim();  // Aqui você pode implementar a lógica de hash para a senha se necessário
    usuario.tipoUsuario = tipoUsuario;  // Atualiza tipoUsuario também

    // Salvar as alterações no banco de dados
    await usuario.save();

    // Resposta de sucesso
    res.json({
      message: 'Dados do usuário atualizados com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario, // Inclui tipoUsuario na resposta
      },
    });

  } catch (error) {
    console.error('Erro ao atualizar os dados do usuário:', error);
    res.status(500).json({ error: 'Erro ao tentar atualizar os dados do usuário.' });
  }
});
// Rota para alterar senha do usuário
app.put('/usuarios/alterar-senha', async (req, res) => {
  console.log('Requisição recebida para alterar senha:', req.body); // Log para verificar os dados recebidos

  const { email, senhaAtual, novaSenha } = req.body;

  // Verifica se todos os campos necessários foram fornecidos
  if (!email || !senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Email, senha atual e nova senha são obrigatórios.' });
  }

  try {
    // Encontrar o usuário pelo e-mail
    const usuario = await Usuario.findOne({ where: { email } });

    // Se o usuário não for encontrado
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Exibir valores antes da comparação para depuração
    console.log("usuario.senha (armazenada):", usuario.senha, "| Tipo:", typeof usuario.senha);
    console.log("senhaAtual (informada):", senhaAtual, "| Tipo:", typeof senhaAtual);

    // Comparar a senha atual com a senha armazenada
    if (usuario.senha.trim() !== senhaAtual.trim()) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    // Atualizar a senha do usuário
    usuario.senha = novaSenha.trim();
    await usuario.save(); // Salvando a nova senha no banco de dados

    // Resposta de sucesso
    res.json({
      message: 'Senha alterada com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });

  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    res.status(500).json({ error: 'Erro ao tentar alterar a senha.' });
  }
});
// Rota para redefinir senha do usuário
app.put('/usuarios/redefinir-senha', async (req, res) => {
  console.log('Requisição recebida para redefinir senha:', req.body);

  const { email, novaSenha, confirmarSenha } = req.body;

  // Verifica se todos os campos necessários foram fornecidos
  if (!email || !novaSenha || !confirmarSenha) {
    return res.status(400).json({ error: 'Email, nova senha e confirmação são obrigatórios.' });
  }

  // Verifica se as senhas coincidem
  if (novaSenha.trim() !== confirmarSenha.trim()) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  try {
    // Buscar usuário pelo e-mail
    const usuario = await Usuario.findOne({ where: { email } });

    // Se o usuário não for encontrado
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Atualizar a senha do usuário
    usuario.senha = novaSenha.trim();
    await usuario.save();

    // Resposta de sucesso
    res.json({
      message: 'Senha redefinida com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });

  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    res.status(500).json({ error: 'Erro ao tentar redefinir a senha.' });
  }
});
// Rota para deletar um usuário
app.delete('/usuario/deletar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id); // Busca um usuário pelo ID
    if (usuario) {
      await usuario.destroy(); // Deleta o usuário
      res.json({ message: 'Usuário deletado com sucesso.' });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

// ---------------------- ROTAS PARA AGENDAMENTOS ----------------------
// Rota para obter todos os agendamentos da view
app.get('/agendamentos_vw', async (req, res) => {
  try {
    const agendamentos = await VwAgendamentos.findAll();
    
    if (agendamentos.length === 0) {
      return res.status(404).json({ message: 'Nenhum agendamento encontrado.' });
    }
    
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error); // Log detalhado do erro
    res.status(500).json({ error: 'Erro ao buscar agendamentos.', details: error.message });
  }
});

// Rota para obter todos os agendamentos
app.get('/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll();
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
});
// Rota para obter um agendamento por ID
app.get('/agendamento/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      res.json(agendamento);
    } else {
      res.status(404).send('Agendamento não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento.' });
  }
});
// Rota para criar um novo agendamento

// Rota para criar um novo agendamento
app.post('/agendamento/inserir', async (req, res) => {
  try {
    // Criação do agendamento
    const novoAgendamento = await Agendamento.create(req.body);

    // Retorno com a resposta de sucesso
    res.status(201).json({
      message: 'Agendamento criado com sucesso!',
      agendamento: novoAgendamento,
    });
  } catch (error) {
    // Retorno com a mensagem de erro
    res.status(500).json({
      message: 'Erro ao inserir agendamento.',
      error: error.message,
    });
  }
});
// Rota para atualizar um agendamento
app.put('/agendamento/atualizar/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      await agendamento.update(req.body);
      res.json(agendamento);
    } else {
      res.status(404).send('Agendamento não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
  }
});

// Rota para deletar um agendamento
app.delete('/agendamento/deletar/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (agendamento) {
      await agendamento.destroy();
      res.json({ message: 'Agendamento deletado com sucesso.' });
    } else {
      res.status(404).send('Agendamento não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar agendamento.' });
  }
});

// ---------------------- ROTAS PARA SERVIÇOS ----------------------

// Rota para obter todos os serviços
app.get('/servicos', async (req, res) => {
  try {
    const servicos = await Servico.findAll();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
});

// Rota para obter um serviço por ID
app.get('/servico/:id', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) {
      res.json(servico);
    } else {
      res.status(404).send('Serviço não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço.' });
  }
});
// Rota para criar um novo serviço
app.post('/servico/inserir', async (req, res) => {
  try {
    const novoServico = await Servico.create(req.body);
    res.status(201).json(novoServico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir serviço.' });
  }
});
// Rota para atualizar um serviço
app.put('/servico/atualizar/:id', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) {
      await servico.update(req.body);
      res.json(servico);
    } else {
      res.status(404).send('Serviço não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço.' });
  }
});
// Rota para deletar um serviço
app.delete('/servico/deletar/:id', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) {
      await servico.destroy();
      res.json({ message: 'Serviço deletado com sucesso.' });
    } else {
      res.status(404).send('Serviço não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar serviço.' });
  }
});
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
