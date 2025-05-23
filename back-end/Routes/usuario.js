const express = require("express");
const router = express.Router();
const Usuario = require("../Models/Usuario");
const Time = require("../Models/Time");
const Agendamento = require("../Models/Agendamentos");
const Horario = require("../Models/Horarios");
const JogadorTime = require("../Models/JogadorTime");
const Quadra = require("../Models/Quadra")
const bcrypt = require("bcrypt");
const { Op, where, fn, col } = require("sequelize");
const passport = require("passport");
const {
  validarCPF,
  validarCNPJ,
  validarEmail,
} = require("../Utils/validarDocumento");
const { message } = require("statuses");
const { getDaySlots,getCadastrados } = require("../Utils/agendamentoUtils");

router.post("/registro", async (req, res) => {
  let erros = [];

  if (!req.body.name) erros.push("Nome inválido!");
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null ||
    !validarEmail(req.body.email)
  ) {
    erros.push({ texto: "Email inválido!" });
  } else {
    const apiKey = "6da1404dd0bccc266369810e5495509947162526";
    const response = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${req.body.email}&api_key=${apiKey}`
    );
    const data = await response.json();
    if (!data.data) {
      erros.push({ texto: "Email inválido!" });
    }
    if (data.data.status === "invalid") {
      erros.push({ texto: "Email inválido!" });
    }
  }
  if (req.body.password.length < 8)
    erros.push("Senha muito curta!(adicione no mínimo 8 caracteres)");
  if (req.body.password !== req.body.confirmPassword)
    erros.push("As senhas são diferentes!");

  const documento = req.body.cpf.replace(/\D/g, "");
  if (documento.length === 11 && !validarCPF(documento))
    erros.push("CPF inválido!");
  if (documento.length === 14 && !validarCNPJ(documento))
    erros.push("CNPJ inválido!");

  if (erros.length > 0) {
    return res.status(400).json({ errors: erros });
  }

  try {
    const usuarioExistente = await Usuario.findOne({
      where: { [Op.or]: [{ email: req.body.email }, { cpf: documento }] },
    });

    if (usuarioExistente) {
      return res
        .status(400)
        .json({ error: "Usuário já cadastrado com este email ou CPF!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const novoUsuario = await Usuario.create({
      name: req.body.name,
      cpf: documento,
      email: req.body.email,
      cellphone: req.body.cellphone,
      password: hash,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/login", async (req, res) => {
  const usuario = req.query.name;
  const senha = req.query.password;
  const usuarioExistente = await Usuario.findOne({ where: { email: usuario } });
  if (!usuarioExistente) {
    res.status(401).json({ error: "Jogador não encontrado." });
    return;
  }
  const passwordMatch = await bcrypt.compare(senha, usuarioExistente.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }
  res
    .status(200)
    .json({ message: "Login realizado com sucesso.", id: usuarioExistente.id, name:usuarioExistente.name, email:usuarioExistente.email, cpf: usuarioExistente.cpf, cellphone:usuarioExistente.cellphone });
});

router.get("/info/:id", async (req, res) => {
  const id = req.params.id;
  //console.log(id)
  if (id === "undefined"){
    //console.log(id)
    res.status(400).json({error: "o id está indefinido"})
  }
else{
const user = await Usuario.findOne({where: {id}});
  if (!user){
    res.status(401).json({error: "Jogador não encontrado."});
    return;
  }
  res.status(200).json({name: user.name, email: user.email, cpf: user.cpf, cellphone: user.cellphone, id: user.id});

}});

router.get("/times/:userId", async (req, res) => {
  const userId = req.params.userId;
  const jogadores = [];
  try {
    const times = await Time.findAll({ where: { userId: userId } });
    for (const time of times) {
      const jogador = await JogadorTime.findOne({ where: { timeId: time.id } });
      jogadores.push(jogador);
    }
    times.jogadores = jogadores;
    return res.status(200).json({ times });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/times", async (req, res) => {
  const nome = req.body.name
  const corPrimaria = req.body.primaryColor
  const corSecundaria = req.body.secondaryColor
  const userId = req.body.userId;
  async function generateUniqueInviteCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code;
    do {
      code = Array(7)
        .fill()
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join("");
    } while (await Time.findOne({ where: { inviteCode: code } }));
    return code;
  }

  try {
    const inviteCode = await generateUniqueInviteCode();
    const newTime = await Time.create({
      userId: userId,
      name: nome,
      img: "",
      primaryColor: corPrimaria,
      secondaryColor: corSecundaria,
      inviteCode: inviteCode,
    });
    return res
      .status(201)
      .json({ message: "Time criado com sucesso!", time: newTime });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/entrar", async (req, res) => {
  const { timeId } = req.body;
  const { jogadorId } = req.user;
  const { invite_code } = req.body;
  try {
    const time = await Time.findOne({ where: { id } });
    if (!time) {
      return res.status(404).json({ error: "Time não encontrado." });
    }
    if (time.invite_code !== invite_code) {
      return res.status(401).json({ error: "Código de convite inválido." });
    }
    const jogador = await JogadorTime.create({
      timeId: timeId,
      jogadorId: jogadorId,
    });
    return res.status(200).json({ message: "Entrada no time autorizada." });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete("/remover", async (req, res) => {
  const { timeId } = req.body;
  const { jogadorId } = req.user;
  try {
    const jogador = await JogadorTime.findOne({ where: { timeId, jogadorId } });
    if (!jogador) {
      return res.status(404).json({ error: "Jogador não encontrado no time." });
    }
    await jogador.destroy();
    return res
      .status(200)
      .json({ message: "Jogador removido do time com sucesso." });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put("/times/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, img, cor_primaria, cor_secundaria, invite_code} =
    req.body;

  const updatedTime = {
    nome,
    img,
    cor_primaria,
    cor_secundaria,
    invite_code
  };

  try {
    await Time.update(updatedTime, { where: { id } });
    return res.status(200).json({ message: "Time atualizado com sucesso!" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put("/edit/:id", async (req, res) => {
  const nome = req.body.name;
  const email = req.body.email;
  const id = req.params.id;
  const documento = req.body.cpf;
  const celular = req.body.cellphone;
  
  const updatedUser = {
    name: nome,
    email: email,
    cpf: documento,
    cellphone: celular,
  };

  try {
    await Usuario.update(updatedUser, { where: { id: id } });
    return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/quadras", async (req,res) =>{
  const quadras = await Quadra.findAll();
  let quadrasDisponiveis = [];
  for (const quadra of quadras) {
      quadrasDisponiveis.push({id: quadra.id, name: quadra.nome});
  }
  return res.status(200).json(quadrasDisponiveis);
})

router.get("/quadras/horarios/:id",async (req,res) => {
  const id = req.params.id;
  let dataInput = req.query.data.split('-');
  const data = dataInput[2]+'-'+dataInput[1]+'-'+dataInput[0]+'T03:00:00'
  const agendamentos = await Agendamento.findAll({where: {
    idQuadra: id,
    [Op.and]: [
      where(fn('DATE', col('data')), data) // compara apenas a parte da data
    ]
  }});
  let slotsOcupados = [];
  for (let agendamento of agendamentos){
    slotsOcupados.push(`${agendamento.horaInicio}-${agendamento.horaFim}`)
  }
  //a data deve estar no 2025-05-14 ou ser convertida para esse formato
  
  const slots = await getDaySlots(new Date(data), id, slotsOcupados);
  
  return res.status(200).json({slotsOcupados: slotsOcupados, slots: slots});
})

router.get('/quadras/:id/dias-bloqueados', async (req, res) => {
  const id = req.params.id;
  const horarios = await Horario.findAll({ where: { quadraId: id } });

  const cadastrados = getCadastrados(horarios)
  console.log(cadastrados)
  const todosDias = [0,1,2,3,4,5,6];
  const naoCadastrados = todosDias.filter(dia => !cadastrados.includes(dia));
  return res.json({ diasBloqueados: naoCadastrados });
});

router.get('/quadras/:id/datas-indisponiveis', async (req, res) => {
  const id = req.params.id;
  const inicio = new Date(req.query.inicio);
  const fim = new Date(req.query.fim);
  let datasIndisponiveis = [];''
  for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
    const slots = await getDaySlots(new Date(d), id, []);
    const agendamentos = await Agendamento.findAll({ where: { idQuadra: id, data: d.toISOString().slice(0,10) } });
    let slotsOcupados = agendamentos.map(a => `${a.horaInicio}-${a.horaFim}`);
    // Se todos os slots estão ocupados, a data está indisponível
   
    if (slots.every(slot => slotsOcupados.includes(slot))) {
      datasIndisponiveis.push(new Date(d).toISOString().slice(0, 10));
    }
  }
  return res.json({ datasIndisponiveis });
});

router.post("/agendar",async (req,res) => {
  const idJogador = req.body.playerId;
  const idQuadra = req.body.court;
  const horarios = req.body.times;
  const data = new Date(req.body.date + 'T03:00:00')
  for (hor of horarios){
    await Agendamento.create({
    idJogador: idJogador,
    idQuadra: idQuadra,
    horaInicio: hor.split('-')[0],
    horaFim: hor.split('-')[1],
    data: data.toISOString().slice(0,10),
  })
  }
  res.status(200).json({message:"Sucesso!"})
})

module.exports = router;
