const express = require("express")
const router = express.Router()
const DonoQuadra = require('../Models/DonoQuadra');
const nodemailer = require("nodemailer");
const Usuario = require("../Models/Usuario");
const Quadra = require('../Models/Quadra');
const Agendamento = require('../Models/Agendamentos')
const bcrypt = require('bcrypt');
const { Op, where } = require('sequelize');
const { validarCPF, validarCNPJ, validarEmail } = require('../Utils/validarDocumento');
const Horario = require("../Models/Horarios");
const Estabelecimento = require("../Models/Estabelecimento");
const Campeonato = require("../Models/Campeonato")
const { message } = require("statuses");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oenhacker123@gmail.com',
      pass: 'uxvw jhij gdxa ryxz'
    },
    tls: {
      rejectUnauthorized: false  // This will solve the self-signed certificate issue
    }
  });

router.post("/registro", async (req, res) => {
    let erros = [];

    if (!req.body.name) erros.push("Nome inválido!");
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null || !validarEmail(req.body.email)) {
        erros.push({ texto: "Email inválido!" });
    }
    else{
        const apiKey = '6da1404dd0bccc266369810e5495509947162526';
        const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${req.body.email}&api_key=${apiKey}`);
        const data = await response.json();
        if(!data.data){

            erros.push({ texto: "Email inválido!" });
        }
        if(data.data.status === 'invalid'){
                erros.push({ texto: "Email inválido!" });
            }
    }
    if (req.body.password.length < 8) erros.push("Senha muito curta!(adicione no mínimo 8 caracteres)");
    // if (req.body.password !== req.body.senha2) erros.push("As senhas são diferentes!");

    const documento = req.body.cpf.replace(/\D/g, '');
    if (documento.length === 11 && !validarCPF(documento)) erros.push("CPF inválido!");
    if (documento.length === 14 && !validarCNPJ(documento)) erros.push("CNPJ inválido!");

    if (erros.length > 0) {
        return res.status(400).json({ errors: erros });
    }

    try {
        const usuarioExistente = await DonoQuadra.findOne({
            where: { [Op.or]: [{ email: req.body.email }, { cpf: req.body.cpf }] }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuário já cadastrado com este email ou CPF!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const novoUsuario = await DonoQuadra.create({
            name: req.body.name,
            cpf: req.body.cpf,
            email: req.body.email,
            password: hash,
        });


        req.session.user = { id: novoUsuario.id, email: novoUsuario.email, nome: novoUsuario.name };

        res.status(201).json({ message: "Usuário registrado com sucesso!" , redirect: '/admin/menu'});
    } catch (err) {
        console.log(err)
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: err.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.get("/login", async (req, res) => {
    try{
    const usuario = req.query.name
    const senha = req.query.password
    const usuarioExistente = await DonoQuadra.findOne({where: {email: usuario}})
    if (!usuarioExistente){
        res.status(401).json({error: "Usuário não encontrado."})
        return
    }
    const passwordMatch = await bcrypt.compare(senha,usuarioExistente.password)
    if (!passwordMatch){
        res.status(401).json({error: "Credenciais inválidas."})
        return
    }
    res.status(201).json({message: "Login realizado com sucesso.", id: usuarioExistente.id, name: usuarioExistente.name}) //TODO retornar todos os dados do admin
}catch(error){
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: error.errors.map(e => e.message).join(', ')
        });
    }
    return res.status(500).json({
        error: 'Erro interno ao atualizar a quadra.'
    });
}
});

router.post('/cadastrarQuadra/:id', async (req, res) => {
    try{
        let horarios = [];
        const nome = req.body.name;
        const tipo = req.body.typeCourt;
        const meioSlot = req.body.timeDivision != "1 hora";
        const porcSinal = req.body.percent / 100;
        const userId = req.params.id;
        const sundayInitial = req.body.sundayInitial
        const sundayEnd = req.body.sundayEnd
        const sundayHour = req.body.sundayHour
        if (sundayEnd){
            horarios.push({diaSemana: "domingo", horaFim: sundayEnd, horaInicio: sundayInitial, valorHora: sundayHour})
        }
        const mondayInitial = req.body.mondayInitial;
        const mondayEnd = req.body.mondayEnd;
        const mondayHour = req.body.mondayHour;
        if (mondayEnd){
            horarios.push({diaSemana: "segunda", horaFim: mondayEnd, horaInicio: mondayInitial, valorHora: mondayHour})
        }
        const tuesdayInitial = req.body.tuesdayInitial;
        const tuesdayEnd = req.body.tuesdayEnd;
        const tuesdayHour = req.body.tuesdayHour;
        if (tuesdayEnd){
            horarios.push({diaSemana: "terça", horaFim: tuesdayEnd, horaInicio: tuesdayInitial, valorHora: tuesdayHour})
        }
        const wednesdayInitial = req.body.wednesdayInitial;
        const wednesdayEnd = req.body.wednesdayEnd;
        const wednesdayHour = req.body.wednesdayHour;
        if (wednesdayEnd){
            horarios.push({diaSemana: "quarta", horaFim: wednesdayEnd, horaInicio: wednesdayInitial, valorHora: wednesdayHour})
        }
        const thursdayInitial = req.body.thursdayInitial;
        const thursdayEnd = req.body.thursdayEnd;
        const thursdayHour = req.body.thursdayHour;
        if (thursdayEnd){
            horarios.push({diaSemana: "quinta", horaFim: thursdayEnd, horaInicio: thursdayInitial, valorHora: thursdayHour})
        }
        const fridayInitial = req.body.fridayInitial;
        const fridayEnd = req.body.fridayEnd;
        const fridayHour = req.body.fridayHour;
        if (fridayEnd){
            horarios.push({diaSemana: "sexta", horaFim: fridayEnd, horaInicio: fridayInitial, valorHora: fridayHour})
        }
        const quadra = {
            nome: nome,
            tipo: tipo,
            meioSlot: meioSlot,
            porcSinal: porcSinal,
            donoQuadraId: userId
        }
        const newQuadra = await Quadra.create(quadra);
        for (let hor of horarios){
            hor.quadraId = newQuadra.id
            await Horario.create(hor);
        }
        return res.json({message: "Quadra cadastrada com sucesso!"})
    }
    catch(error){
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.post("/recover/password/:email", async (req,res) => {
  const emailJogador = req.params.email;
  const novaSenha = req.query.newPassword;
  try{
  const jogador = await DonoQuadra.findOne({where:{email: emailJogador}});
  if (!jogador){
    res.status(404).json({ error: "Jogador não encontrado." });
    return
  }
  const mailOptions = {
            from: 'oenhacker123@gmail.com',
            to: emailJogador,
            subject: 'Troca de Senha Requisitada',
            html: `
                <html style="font-family: 'Lato', sans-serif;">
                <head>
                <title>Troca de senha</title>
                </head>
                <body style="background-color: #f2f2f2; margin: 0;">
                <div style="display: flex; flex-direction: column; align-items: center;"
                    <h1 style="color: #4CAF50;">Clique no link abaixo para redefinir sua senha:</h1>
                    <button onclick="http://localhost:8081/api/admin/change/password?email=${emailJogador}&newPassword=${novaSenha}">Redefinir senha para: ${novaSenha}</button>
                </div>
                </body>
                </html>
            `
        };
          await transporter.sendMail(mailOptions);
          res.status(200).json({ message: 'Notificação enviada com sucesso' });
        }catch(err){
          console.log(err.message);
          res.status(400).json({ error: err.message });
        }
});

router.get("/change/password", async (req,res) => {
  const email = req.query.email;
  const novaSenha = req.query.newPassword;
  const jogador = await DonoQuadra.findOne({where:{email: email}});
  if (!jogador){
    res.status(401).json({ error: "Jogador não encontrado." });
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(novaSenha, salt);
        try{
          jogador.password = hash
          await DonoQuadra.update(jogador,{where:{email: email}});
          res.status(200).json({ message: 'Senha Alterada com sucesso' });
        }catch(err){
          console.log(err.message);
          res.status(400).json({ error: err.message });
        }
});

router.post('/cadastrarEstabelecimento/:id', async (req, res) => {
    
    try{
        const nome = req.body.nome;
        const cep = req.body.cep;
        const rua = req.body.rua;
        const bairro = req.body.bairro;
        const numero = req.body.numero;
        const cidade_estado = req.body.cidade_estado;
        const hora_inicio = req.body.hora_inicio
        const hora_fim = req.body.hora_fim
        const userId = req.body.donoQuadraId
        const estabelecimento = {
            nome: nome,
            cep: cep,
            rua: rua,
            bairro:  bairro,
            numero:  numero,
            cidade_estado:  cidade_estado,
            hora_inicio:  hora_inicio,
            hora_fim:  hora_fim,
            donoQuadraId: userId
        }
        const newEstabelecimento = await Estabelecimento.create(estabelecimento);
        return res.json({message: "Estabelecimento cadastrado com sucesso!"})
    }
    catch(error){
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.get('/quadras/:id', async (req,res) => {
    let mapQuadras = [];
    try{ 
        const userId = req.params.id
        const quadras = await Quadra.findAll({where: {donoQuadraId: userId}});
        for (let quadra of quadras){
            mapQuadras.push({name: quadra.nome, id: quadra.id})
        }
        return res.json(mapQuadras)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/quadras/ids/:id', async (req,res) => {
    let mapQuadras = [];
    try{ 
        const userId = req.params.id
        const quadras = await Quadra.findAll({where: {donoQuadraId: userId}});
        for (let quadra of quadras){
            mapQuadras.push(quadra.id)
        }
        return res.json(mapQuadras)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get("/agendamentos", async (req, res) => {
  const quadrasIds = req.query.quadras.split(',').map(Number);
  let appointments = [];
  try {
    const agendamentos = await Agendamento.findAll({
      where: {
        idQuadra: {
          [Op.in]: quadrasIds
        }
      }
    });
    for (let agend of agendamentos) {
      const data = new Date(agend.data);
      const quadra = await Quadra.findOne({where: {id: agend.idQuadra}});
      const jogador = await Usuario.findOne({where: {id: agend.idJogador}});
      appointments.push({
        type: "rachão",
        date: data.toLocaleDateString('pt-BR'),
        adversary: "",
        player: jogador.name,
        times: [`${agend.horaInicio.slice(0, 5)}-${agend.horaFim.slice(0, 5)}`],
        status: agend.pago ? "Pago" : "Pagamento Pendente",
        court: quadra.nome,
        id: agend.id
      });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(err)
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: err.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.get("/agendamentos/type/:id", async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido" });
    }
    const agendamento = await Agendamento.findOne({ where: { id } });
    if (!agendamento) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
    }
    return res.status(200).json({ type: agendamento.tipo, message: "Sucesso!" });
});

router.get('/info/:id', async (req,res) => {
    
    try{ 
        const userId = req.params.id
        const user = await DonoQuadra.findOne({where: {id: userId}});
        return res.json(user)
    }
    catch(error){
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
})

router.get('/quadra/:id', async (req,res) => {
    
    try{ 
        const quadraId = req.params.id
        const quadra = await Quadra.findOne({where: {id: quadraId}});
        const horarios = await Horario.findAll({where: {quadraId: quadraId}})
        return res.json({quadra, horarios})
    }
    catch(error){
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
})

router.put('/atualizarQuadra/:id', async (req, res) => {
    try{
        const id = req.params.id;
        let horarios = [];
        const nome = req.body.name;
        const tipo = req.body.typeCourt;
        const meioSlot = req.body.timeDivision != "1 hora";
        const porcSinal = req.body.percent / 100;
        const sundayInitial = req.body.sundayInitial
        const sundayEnd = req.body.sundayEnd
        const sundayHour = req.body.sundayHour
        if (sundayEnd){
            horarios.push({diaSemana: "domingo", horaFim: sundayEnd, horaInicio: sundayInitial, valorHora: sundayHour})
        }
        const mondayInitial = req.body.mondayInitial;
        const mondayEnd = req.body.mondayEnd;
        const mondayHour = req.body.mondayHour;
        if (mondayEnd){
            horarios.push({diaSemana: "segunda", horaFim: mondayEnd, horaInicio: mondayInitial, valorHora: mondayHour})
        }
        const tuesdayInitial = req.body.tuesdayInitial;
        const tuesdayEnd = req.body.tuesdayEnd;
        const tuesdayHour = req.body.tuesdayHour;
        if (tuesdayEnd){
            horarios.push({diaSemana: "terça", horaFim: tuesdayEnd, horaInicio: tuesdayInitial, valorHora: tuesdayHour})
        }
        const wednesdayInitial = req.body.wednesdayInitial;
        const wednesdayEnd = req.body.wednesdayEnd;
        const wednesdayHour = req.body.wednesdayHour;
        if (wednesdayEnd){
            horarios.push({diaSemana: "quarta", horaFim: wednesdayEnd, horaInicio: wednesdayInitial, valorHora: wednesdayHour})
        }
        const thursdayInitial = req.body.thursdayInitial;
        const thursdayEnd = req.body.thursdayEnd;
        const thursdayHour = req.body.thursdayHour;
        if (thursdayEnd){
            horarios.push({diaSemana: "quinta", horaFim: thursdayEnd, horaInicio: thursdayInitial, valorHora: thursdayHour})
        }
        const fridayInitial = req.body.fridayInitial;
        const fridayEnd = req.body.fridayEnd;
        const fridayHour = req.body.fridayHour;
        if (fridayEnd){
            horarios.push({diaSemana: "sexta", horaFim: fridayEnd, horaInicio: fridayInitial, valorHora: fridayHour})
        }
        const quadra = {
            nome: nome,
            tipo: tipo,
            meioSlot: meioSlot,
            porcSinal: porcSinal,
        }
        await Horario.destroy({where:{quadraId: id}})
        await Quadra.update(quadra,{where:{id: id}});
        for (let hor of horarios){
            hor.quadraId = id
            await Horario.create(hor);
        }
        return res.json({message: "Quadra atualizada com sucesso!"})
    }
    catch(error){
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.delete('/excluirQuadra/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Deleta a quadra pelo ID
        const result = await Quadra.destroy({ where: { id: id } });

        if (result === 0) {
            return res.status(404).json({ message: "Quadra não encontrada." });
        }

        return res.json({ message: "Quadra deletada com sucesso!" });
    } catch (error) {
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
});

router.put('/agendamentos/pagamento/confirmar/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const agendamento = await Agendamento.findOne({where: {id}}); // Added await
        if (!agendamento){
            res.status(404).json({error: "Agendamento não encontrado"});
        }else{
            await Agendamento.update({ pago: true }, { where: { id } }); 
            res.status(200).json({message: "Pagamento confirmado"});
        }
    }catch(err){
        console.log(err)
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: err.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: 'Erro interno ao atualizar a quadra.'
        });
    }
})

router.post('/campeonato/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const nome = req.body.name;
        const dataInicio = req.body.initialDate;
        const numTimes = req.body.teamsNumber;
        const descricao = req.body.description;
        const registro = req.body.registration;
        const premiacao = req.body.premiation;
        const quadraId = req.body.quadraId; // Added to receive the ID of the specific court

        const campeonatoData = {
            nome: nome,
            data_inicio: dataInicio,
            registro: registro,
            descricao: descricao,
            num_times: numTimes,
            premiacao: premiacao,
            donoQuadraId: id, // Corrected: Links to the DonoQuadra (owner account)
            quadraId: quadraId // Added: Links to the specific Quadra (court)
        };
        await Campeonato.create(campeonatoData);
        res.status(200).json({message: "Campeonato criado com sucesso!"})
    }catch(err){
        console.log(err)
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: err.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({
            error: err.errors.map(e => e.message).join(', ')
        });
    }
})

//exportando o modulo
module.exports = router