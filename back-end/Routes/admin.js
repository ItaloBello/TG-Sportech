const express = require("express")
const router = express.Router()
const DonoQuadra = require('../Models/DonoQuadra');
const Quadra = require('../Models/Quadra');
const bcrypt = require('bcrypt');
const { Op, where } = require('sequelize');
const { validarCPF, validarCNPJ, validarEmail } = require('../Utils/validarDocumento');
const Horario = require("../Models/Horarios");
const Estabelecimento = require("../Models/Estabelecimento");
const { message } = require("statuses");



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
            where: { [Op.or]: [{ email: req.body.email }, { documento: req.body.cpf }] }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuário já cadastrado com este email ou CPF!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const novoUsuario = await DonoQuadra.create({
            nome: req.body.name,
            documento: req.body.cpf,
            email: req.body.email,
            senha: hash,
        });

        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post("/login", async (req, res) => {
    const usuario = req.body.documento
    const senha = req.body.password
    const usuarioExistente = await DonoQuadra.findOne({where: {documento: usuario}})
    if (!usuarioExistente){
        res.status(401).json({error: "Usuário não encontrado."})
        return
    }
    const passwordMatch = await bcrypt.compare(senha,usuarioExistente.password)
    if (!passwordMatch){
        res.status(401).json({error: "Credenciais inválidas."})
        return
    }
    res.status(200).json({message: "Login realizado com sucesso.", id: usuarioExistente.id})
});

router.post('/cadastrarQuadra', async (req, res) => {
    
    try{
        const nome = req.body.nome;
        const tipo = req.body.tipo;
        const meioSlot = req.body.meioSlot;
        const porcSinal = req.body.porcSinal;
        const userId = req.body.donoQuadraId;
        const horarios = req.body.horarios;
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
        return res.json({message: error})
    }
});

router.post('/cadastrarEstabelecimento', async (req, res) => {
    
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
        return res.json({message: error})
    }
});

router.get('/quadras/:id', async (req,res) => {
    
    try{ 
        const userId = req.params.id
        const quadras = await Quadra.findAll({where: {usuarioId: userId}});
        return res.json(quadras)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/info/:id', async (req,res) => {
    
    try{ 
        const userId = req.params.id
        const user = await DonoQuadra.findOne({where: {id: userId}});
        return res.json(user)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.get('/quadra/:id', async (req,res) => {
    
    try{ 
        const quadraId = req.params.id
        const quadra = await Quadra.findOne({where: {id: quadraId}});
        return res.json(quadra)
    }
    catch(error){
        return res.json({message: error})
    }
})

router.put('/atualizarQuadra/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, tipo, usuarioId } = req.body;

        const quadra = {
            nome: nome,
            tipo: tipo,
            usuarioId: usuarioId
        };

        const [updated] = await Quadra.update(quadra, { where: { id: id } });

        if (updated) {
            return res.json({ message: "Quadra editada com sucesso!" });
        } else {
            return res.status(404).json({ message: "Quadra não encontrada para o ID especificado." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar quadra: " + error.message });
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
        console.error(error); // Log do erro para depuração
        return res.status(500).json({ message: "Erro ao deletar a quadra.", error: error.message });
    }
});

//exportando o modulo
module.exports = router