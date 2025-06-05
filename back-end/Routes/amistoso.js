const express = require("express");
const router = express.Router();
const Amistoso = require('../Models/Amistoso');
const Time = require('../Models/Time');
const Quadra = require('../Models/Quadra');
const Usuario = require('../Models/Usuario');
const { Op } = require('sequelize');

// Middleware para verificar se o usuário é dono da quadra
const isDonoQuadra = (req, res, next) => {
    if (req.user && req.user.tipo === 'dono') {
        return next();
    }
    return res.status(401).json({ error: 'Acesso não autorizado' });
};

// Middleware para verificar se o usuário é dono do time
const isDonoTime = async (req, res, next) => {
    try {
        const timeId = req.params.timeId || req.body.timeId;
        const time = await Time.findByPk(timeId);
        
        if (!time) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }
        
        if (req.user && time.userId === req.user.id) {
            return next();
        }
        
        return res.status(401).json({ error: 'Você não é o dono deste time' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao verificar permissão' });
    }
};

// Criar um desafio de amistoso
router.post('/desafiar', isDonoTime, async (req, res) => {
    try {
        const { timeDesafianteId, timeDesafiadoId, quadraId, data, hora, valor } = req.body;
        
        // Verificar se os times existem
        const timeDesafiante = await Time.findByPk(timeDesafianteId);
        const timeDesafiado = await Time.findByPk(timeDesafiadoId);
        
        if (!timeDesafiante || !timeDesafiado) {
            return res.status(404).json({ error: 'Um ou ambos os times não foram encontrados' });
        }
        
        // Verificar se a quadra existe
        const quadra = await Quadra.findByPk(quadraId);
        if (!quadra) {
            return res.status(404).json({ error: 'Quadra não encontrada' });
        }
        
        // Verificar se já existe um amistoso entre esses times na mesma data/hora
        const amistososExistentes = await Amistoso.findOne({
            where: {
                [Op.or]: [
                    { timeDesafianteId, timeDesafiadoId },
                    { timeDesafianteId: timeDesafiadoId, timeDesafiadoId: timeDesafianteId }
                ],
                data,
                hora,
                status: { [Op.ne]: 'rejeitado' }
            }
        });
        
        if (amistososExistentes) {
            return res.status(400).json({ error: 'Já existe um amistoso agendado entre esses times nessa data e hora' });
        }
        
        // Criar o amistoso
        const amistoso = await Amistoso.create({
            timeDesafianteId,
            timeDesafiadoId,
            quadraId,
            data,
            hora,
            valor,
            status: 'pendente'
        });
        
        return res.status(201).json({
            message: 'Desafio enviado com sucesso',
            amistoso
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar desafio' });
    }
});

// Aceitar ou rejeitar um desafio
router.put('/:id/responder', isDonoTime, async (req, res) => {
    try {
        const { id } = req.params;
        const { resposta } = req.body; // 'aceito' ou 'rejeitado'
        
        // Verificar se o amistoso existe
        const amistoso = await Amistoso.findByPk(id, {
            include: [
                { model: Time, as: 'timeDesafiado' },
                { model: Time, as: 'timeDesafiante' }
            ]
        });
        
        if (!amistoso) {
            return res.status(404).json({ error: 'Amistoso não encontrado' });
        }
        
        // Verificar se o usuário é dono do time desafiado
        if (amistoso.timeDesafiado.userId !== req.user.id) {
            return res.status(401).json({ error: 'Você não tem permissão para responder a este desafio' });
        }
        
        // Verificar se o amistoso ainda está pendente
        if (amistoso.status !== 'pendente') {
            return res.status(400).json({ error: 'Este desafio já foi respondido' });
        }
        
        // Atualizar o status do amistoso
        await Amistoso.update({
            status: resposta
        }, {
            where: { id }
        });
        
        return res.status(200).json({ message: `Desafio ${resposta === 'aceito' ? 'aceito' : 'rejeitado'} com sucesso` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao responder ao desafio' });
    }
});

// Confirmar pagamento de um amistoso (dono da quadra)
router.put('/:id/confirmar-pagamento', isDonoQuadra, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o amistoso existe
        const amistoso = await Amistoso.findByPk(id);
        
        if (!amistoso) {
            return res.status(404).json({ error: 'Amistoso não encontrado' });
        }
        
        // Verificar se o amistoso foi aceito
        if (amistoso.status !== 'aceito') {
            return res.status(400).json({ error: 'Este amistoso não foi aceito pelo time desafiado' });
        }
        
        // Atualizar o status do amistoso
        await Amistoso.update({
            status: 'pago',
            dataPagamento: new Date()
        }, {
            where: { id }
        });
        
        return res.status(200).json({ message: 'Pagamento confirmado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao confirmar pagamento' });
    }
});

// Registrar resultado de um amistoso
router.put('/:id/resultado', isDonoQuadra, async (req, res) => {
    try {
        const { id } = req.params;
        const { golsTimeDesafiante, golsTimeDesafiado } = req.body;
        
        // Verificar se o amistoso existe
        const amistoso = await Amistoso.findByPk(id);
        
        if (!amistoso) {
            return res.status(404).json({ error: 'Amistoso não encontrado' });
        }
        
        // Verificar se o amistoso foi pago
        if (amistoso.status !== 'pago') {
            return res.status(400).json({ error: 'Este amistoso ainda não foi pago' });
        }
        
        // Atualizar o resultado do amistoso
        await Amistoso.update({
            golsTimeDesafiante,
            golsTimeDesafiado,
            status: 'finalizado'
        }, {
            where: { id }
        });
        
        return res.status(200).json({ message: 'Resultado registrado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao registrar resultado' });
    }
});

// Listar amistosos de um time (tanto desafiante quanto desafiado)
router.get('/time/:timeId', async (req, res) => {
    try {
        const { timeId } = req.params;
        
        const amistosos = await Amistoso.findAll({
            where: {
                [Op.or]: [
                    { timeDesafianteId: timeId },
                    { timeDesafiadoId: timeId }
                ]
            },
            include: [
                { model: Time, as: 'timeDesafiante' },
                { model: Time, as: 'timeDesafiado' },
                { model: Quadra }
            ],
            order: [['data', 'DESC']]
        });
        
        return res.status(200).json(amistosos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar amistosos' });
    }
});

// Listar amistosos pendentes para um time desafiado
router.get('/pendentes/:timeId', async (req, res) => {
    try {
        const { timeId } = req.params;
        
        const amistosos = await Amistoso.findAll({
            where: {
                timeDesafiadoId: timeId,
                status: 'pendente'
            },
            include: [
                { model: Time, as: 'timeDesafiante' },
                { model: Quadra }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        return res.status(200).json(amistosos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar desafios pendentes' });
    }
});

// Listar amistosos para uma quadra
router.get('/quadra/:quadraId', isDonoQuadra, async (req, res) => {
    try {
        const { quadraId } = req.params;
        const { status } = req.query; // Filtro opcional por status
        
        const where = { quadraId };
        
        if (status) {
            where.status = status;
        }
        
        const amistosos = await Amistoso.findAll({
            where,
            include: [
                { model: Time, as: 'timeDesafiante' },
                { model: Time, as: 'timeDesafiado' },
                { model: Quadra }
            ],
            order: [['data', 'ASC']]
        });
        
        return res.status(200).json(amistosos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar amistosos' });
    }
});

// Obter detalhes de um amistoso específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const amistoso = await Amistoso.findByPk(id, {
            include: [
                { model: Time, as: 'timeDesafiante' },
                { model: Time, as: 'timeDesafiado' },
                { model: Quadra }
            ]
        });
        
        if (!amistoso) {
            return res.status(404).json({ error: 'Amistoso não encontrado' });
        }
        
        return res.status(200).json(amistoso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar detalhes do amistoso' });
    }
});

module.exports = router;
