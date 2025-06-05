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
const multer = require("multer");
const path = require("path");

// Configuração do Multer para upload de fotos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
          return cb(null, true);
      }
      cb(new Error('Apenas imagens são permitidas!'));
  }
});

router.post("/registro", async (req, res) => {
  let erros = [];
  console.log('cadastrando')
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
    console.log(erros)
    return res.status(400).json({ errors: erros });
  }

  try {
    const usuarioExistente = await Usuario.findOne({
      where: { [Op.or]: [{ email: req.body.email }, { cpf: documento }] },
    });

    if (usuarioExistente) {
      console.log("cpf ou email")
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

router.get("/login", async (req, res) => {
    try{
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

  try {
    const times = await Time.findAll({ where: { userId: userId } });

    const timesComJogadores = await Promise.all(
      times.map(async (time) => {
        const jogadores = await JogadorTime.findAll({ where: { timeId: time.id } });

        // Converta o objeto Sequelize em um objeto puro
        const plainTime = time.toJSON();

        // Formata a data
        const data = new Date(plainTime.data_criacao);
        plainTime.data_criacao = data.toLocaleDateString("pt-BR");
        // Adiciona o jogador
        plainTime.jogadores = jogadores;

        return plainTime;
      })
    );

    return res.status(200).json({ times: timesComJogadores });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/times/subscription/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    let idsTime = [];
    const jogadores = await JogadorTime.findAll({where: {jogadorId: userId}})
    for (let jg of jogadores){
      idsTime.push(jg.timeId)
    }
    const times = await Time.findAll({ where: { id: {[Op.in]: idsTime}} });
    const timesQueParticipo = await Promise.all(
      times.map(async (time) => {
        const jogadores = await JogadorTime.findAll({ where: { timeId: time.id } });

        // Converta o objeto Sequelize em um objeto puro
        const plainTime = time.toJSON();

        // Formata a data
        const data = new Date(plainTime.data_criacao);
        plainTime.data_criacao = data.toLocaleDateString("pt-BR");
        // Adiciona o jogador
        plainTime.jogadores = jogadores;

        return plainTime;
      })
    );

    return res.status(200).json({ times: timesQueParticipo });
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

router.post("/times", upload.single("foto"), async (req, res) => {
  const nome = req.body.name;
  const corPrimaria = req.body.primaryColor;
  const corSecundaria = req.body.secondaryColor;
  const userId = req.body.userId;
  const filename = req.file? req.file.filename : null;
  //const filepath = req.file.path;
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
      img: filename? "http://localhost:8081/uploads/"+filename : "http://localhost:8081/uploads/defaultTeam.png",
      primaryColor: corPrimaria,
      secondaryColor: corSecundaria,
      inviteCode: inviteCode,
    });
    return res
      .status(201)
      .json({ message: "Time criado com sucesso!", time: newTime });
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

router.post("/entrar/:id", async (req, res) => {
  const jogadorId = req.params.id;
  const invite_code = req.body.inviteCode;
  try {
    const time = await Time.findOne({ where: { inviteCode: invite_code } });
    if (!time) {
      return res.status(404).json({ error: "Time não encontrado." });
    }
    const jogador = await JogadorTime.create({
      timeId: time.id,
      jogadorId: jogadorId,
    });
    return res.status(200).json({ message: "Entrada no time autorizada." });
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

router.delete("/remover", async (req, res) => {
  const timeId = req.body.timeId;
  const jogadorId = req.body.jogadorId;
  try {
    const jogador = await JogadorTime.findOne({ where: { timeId, jogadorId } });
    if (!jogador) {
      return res.status(404).json({ error: "Jogador não encontrado no time." });
    }
    await jogador.destroy();
    return res
      .status(200)
      .json({ message: "Jogador removido do time com sucesso." });
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

router.put("/times/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cor_primaria, cor_secundaria} =
    req.body;

  const updatedTime = {
    name: nome,
    primaryColor: cor_primaria,
    secondaryColor: cor_secundaria,
  };

  try {
    const result = await Time.update(updatedTime, { where: { id } });
    console.log(result);
    return res.status(200).json({ message: "Time atualizado com sucesso!" });
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
    slotsOcupados.push(`${agendamento.horaInicio.slice(0,5)}-${agendamento.horaFim.slice(0,5)}`)
  }
  //a data deve estar no 2025-05-14 ou ser convertida para esse formato
  
  const slots = await getDaySlots(new Date(data), id, slotsOcupados);
  return res.status(200).json({slotsOcupados: slotsOcupados, slots: slots});
})

router.get('/quadras/:id/dias-bloqueados', async (req, res) => {
  const id = req.params.id;
  const horarios = await Horario.findAll({ where: { quadraId: id } });

  const cadastrados = getCadastrados(horarios)
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
  try{
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
    tipo: "rachão"
  })
  }
  res.status(200).json({message:"Sucesso!"})
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
})

router.get("/agendamentos/:id", async (req, res) => {
  const idJogador = req.params.id;
  try {
    let appointments =  [];
    const agendamentos = await Agendamento.findAll({ where: { idJogador: idJogador? idJogador: 0 } });
    for(agend of agendamentos){
      const data = new Date(agend.data);
      const quadra = await Quadra.findOne({where: {id: agend.idQuadra}});
      appointments.push({
        type: "rachão",
        date: data.toLocaleDateString('pt-BR'),
        adversary: "",
        times: [
          agend.horaInicio.slice(0, 5) + '-' + agend.horaFim.slice(0, 5)
        ],
        status: agend.pago ? "Pago" : "Pagamento Pendente",
        court: quadra.nome,
        id: agend.id,
      });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.get("/times", async (req,res) => {
  let mapTimes = [];
  const times = await Time.findAll({where: {userId: req.user.id}})
  for (let time of times){
    mapTimes.push({name: time.name, id: time.id})
  }
  res.status(200).json(mapTimes)
})

router.get("/time/:id", async (req, res) => {
  const id = req.params.id;
  const userId = req.query.userId; // ID do usuário que está solicitando
  
  try {
    // Busca o time
    const time = await Time.findOne({ where: { id: id } });
    if (!time) {
      return res.status(404).json({ error: "Time não encontrado." });
    }
    
    // Busca os jogadores do time
    const jogadoresTime = await JogadorTime.findAll({
      where: { timeId: id }
    });
    
    // Busca os dados dos jogadores separadamente
    const jogadoresIds = jogadoresTime.map(jt => jt.jogadorId);
    const jogadoresData = await Usuario.findAll({
      where: { id: { [Op.in]: jogadoresIds } },
      attributes: ['id', 'name', 'email', 'cellphone']
    });
    
    // Formata os dados dos jogadores
    const jogadores = jogadoresData.map(jogador => ({
      id: jogador.id,
      name: jogador.name,
      email: jogador.email,
      cellphone: jogador.cellphone
    }));
    
    // Verifica se o usuário solicitante é o dono do time
    const isOwner = time.userId === parseInt(userId);
    
    res.status(200).json({
      time,
      jogadores,
      isOwner
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar time." });
  }
});

router.delete("/times/:id", async (req,res) => {
  const id = req.params.id;
  try {
    // Remove todos os jogadores associados a esse time
    await JogadorTime.destroy({ where: { timeId: id } });
    // Agora remove o time
    await Time.destroy({ where: { id: id } });
    res.status(200).json({ message: "Time e jogadores deletados com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao deletar time e jogadores." });
  }
});

module.exports = router;
