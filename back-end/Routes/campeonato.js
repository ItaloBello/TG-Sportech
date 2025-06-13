const express = require("express");
const router = express.Router();
const Campeonato = require('../Models/Campeonato');
const TimeCampeonato = require('../Models/TimeCampeonato');
const Partida = require('../Models/Partida');
const Gol = require('../Models/Gol');
const Time = require('../Models/Time');
const Usuario = require('../Models/Usuario');
const Quadra = require('../Models/Quadra');
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
        const playerId = req.user?.id || req.body.playerId; // pega do token ou do corpo
        const time = await Time.findByPk(timeId);
        
        if (!time) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }
        
        if (playerId && time.userId === Number(playerId)) {
            return next();
        }
        
        return res.status(401).json({ error: 'Você não é o dono deste time' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao verificar permissão' });
    }
};

// ===== ROTAS PARA DONO DA QUADRA =====

// Listar todos os campeonatos de uma quadra
router.get('/quadra/:quadraId', async (req, res) => {
    try {
        const { quadraId } = req.params;
        const campeonatos = await Campeonato.findAll({
            where: { donoQuadraId: quadraId },
            order: [['data_inicio', 'DESC']]
        });
        
        return res.status(200).json(campeonatos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar campeonatos' });
    }
});

// Listar campeonatos disponíveis para inscrição
router.get('/disponiveis', async (req, res) => {
    try {
        const campeonatos = await Campeonato.findAll({
            where: {
                status: 'não iniciado',
                data_inicio: {
                    [Op.gt]: new Date() // Data de início maior que hoje
                }
            },
            include: [{ model: Quadra, as: 'quadra' }]
        });
        // Mapeia para o formato esperado pelo front-end
        const campeonatosFormatados = campeonatos.map(c => ({
            id: c.id,
            title: c.nome,
            initialDate: c.data_inicio,
            premiation: c.premiacao,
            registration: c.registro,
            image: c.image || '/default-campeonato.png',
            status: c.status,
            num_teams: c.num_times,
            description: c.descricao,
            court: c.quadra || null,
            ...c.toJSON()
        }));
        return res.status(200).json(campeonatosFormatados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar campeonatos disponíveis' });
    }
});

// Obter detalhes de um campeonato específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const campeonato = await Campeonato.findByPk(id);
        
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        // Buscar times inscritos
        const timesInscritos = await TimeCampeonato.findAll({
            where: { campeonatoId: id },
            include: [{ model: Time }]
        });
        
        // Buscar partidas
        const partidas = await Partida.findAll({
            where: { campeonatoId: id },
            include: [
                { model: Time, as: 'timeA' },
                { model: Time, as: 'timeB' },
                { model: Quadra }
            ]
        });
        
        return res.status(200).json({
            campeonato,
            timesInscritos,
            partidas
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar detalhes do campeonato' });
    }
});

// Atualizar informações do campeonato
router.put('/:id', isDonoQuadra, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data_inicio, num_times, descricao, premiacao, registro, status } = req.body;
        
        const campeonato = await Campeonato.findByPk(id);
        
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        // Verificar se o usuário é dono do campeonato
        if (campeonato.donoQuadraId !== req.user.id) {
            return res.status(401).json({ error: 'Você não tem permissão para editar este campeonato' });
        }
        
        await Campeonato.update({
            nome,
            data_inicio,
            num_times,
            descricao,
            premiacao,
            registro,
            status
        }, {
            where: { id }
        });
        
        return res.status(200).json({ message: 'Campeonato atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        return res.status(500).json({ error: 'Erro ao atualizar campeonato' });
    }
});

// Criar uma partida para um campeonato
router.post('/:id/partidas', isDonoQuadra, async (req, res) => {
    try {
        const { id } = req.params;
        const { timeAId, timeBId, quadraId, data, hora, fase } = req.body;
        
        // Verificar se o campeonato existe
        const campeonato = await Campeonato.findByPk(id);
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        // Verificar se os times estão inscritos no campeonato
        const timeAInscrito = await TimeCampeonato.findOne({
            where: { campeonatoId: id, timeId: timeAId }
        });
        
        const timeBInscrito = await TimeCampeonato.findOne({
            where: { campeonatoId: id, timeId: timeBId }
        });
        
        if (!timeAInscrito || !timeBInscrito) {
            return res.status(400).json({ error: 'Um ou ambos os times não estão inscritos neste campeonato' });
        }
        
        // Criar a partida
        const partida = await Partida.create({
            campeonatoId: id,
            timeAId,
            timeBId,
            quadraId,
            data,
            hora,
            fase,
            status: 'agendado'
        });
        
        // Após criar a partida, tenta atualizar o status do campeonato
        await atualizarStatusCampeonato(id);
        
        return res.status(201).json({
            message: 'Partida criada com sucesso',
            partida
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar partida' });
    }
});

// Registrar resultado de uma partida
router.put('/partidas/:partidaId/resultado', isDonoQuadra, async (req, res) => {
    try {
        const { partidaId } = req.params;
        const { golsTimeA, golsTimeB, gols } = req.body;
        
        // Verificar se a partida existe
        const partida = await Partida.findByPk(partidaId);
        if (!partida) {
            return res.status(404).json({ error: 'Partida não encontrada' });
        }
        
        // Atualizar o resultado da partida
        await Partida.update({
            golsTimeA,
            golsTimeB,
            status: 'finalizado'
        }, {
            where: { id: partidaId }
        });
        
        // Registrar gols para artilharia (se fornecidos)
        if (gols && Array.isArray(gols)) {
            for (const gol of gols) {
                await Gol.create({
                    partidaId,
                    jogadorId: gol.jogadorId,
                    timeId: gol.timeId,
                    quantidade: gol.quantidade || 1
                });
            }
        }
        
        return res.status(200).json({ message: 'Resultado registrado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao registrar resultado' });
    }
});

// Gerar chaveamento automático para próxima fase
router.post('/:id/gerar-chaveamento', isDonoQuadra, async (req, res) => {
    try {
        const { id } = req.params;
        const { fase, quadraId, data, hora } = req.body;
        
        // Verificar se o campeonato existe
        const campeonato = await Campeonato.findByPk(id);
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        // Buscar partidas da fase anterior que já foram finalizadas
        let faseAnterior;
        let proximaFase;
        
        switch (fase) {
            case 'quartas':
                faseAnterior = 'oitavas';
                proximaFase = 'quartas';
                break;
            case 'semi':
                faseAnterior = 'quartas';
                proximaFase = 'semi';
                break;
            case 'final':
                faseAnterior = 'semi';
                proximaFase = 'final';
                break;
            default:
                return res.status(400).json({ error: 'Fase inválida' });
        }
        
        const partidasFaseAnterior = await Partida.findAll({
            where: {
                campeonatoId: id,
                fase: faseAnterior,
                status: 'finalizado'
            }
        });
        
        // Verificar se todas as partidas da fase anterior foram finalizadas
        const numEsperado = fase === 'quartas' ? 8 : (fase === 'semi' ? 4 : 2);
        if (partidasFaseAnterior.length < numEsperado) {
            return res.status(400).json({ 
                error: `Nem todas as partidas da fase ${faseAnterior} foram finalizadas` 
            });
        }
        
        // Determinar os vencedores
        const vencedores = partidasFaseAnterior.map(partida => {
            if (partida.golsTimeA > partida.golsTimeB) {
                return partida.timeAId;
            } else {
                return partida.timeBId;
            }
        });
        
        // Embaralhar os vencedores para sorteio aleatório
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };
        
        const vencedoresEmbaralhados = shuffleArray(vencedores);
        
        // Criar as novas partidas
        const novasPartidas = [];
        for (let i = 0; i < vencedoresEmbaralhados.length; i += 2) {
            if (i + 1 < vencedoresEmbaralhados.length) {
                const partida = await Partida.create({
                    campeonatoId: id,
                    timeAId: vencedoresEmbaralhados[i],
                    timeBId: vencedoresEmbaralhados[i + 1],
                    quadraId,
                    data,
                    hora,
                    fase: proximaFase,
                    status: 'agendado'
                });
                novasPartidas.push(partida);
            }
        }
        
        return res.status(201).json({
            message: `Chaveamento para fase ${proximaFase} gerado com sucesso`,
            partidas: novasPartidas
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao gerar chaveamento' });
    }
});

// ===== ROTAS PARA TIMES =====

// Listar campeonatos em que um time está inscrito
router.get('/time/:timeId', async (req, res) => {
    try {
      const { timeId } = req.params;
      const inscricoes = await TimeCampeonato.findAll({
        where: { timeId },
        include: [
          { model: Campeonato },
          { model: Time }
        ]
      });
      res.json(inscricoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar inscrições do time' });
    }
  });

// Função utilitária para atualizar status do campeonato
async function atualizarStatusCampeonato(campeonatoId) {
    const campeonato = await Campeonato.findByPk(campeonatoId);
    if (!campeonato) return;
    const numInscritos = await TimeCampeonato.count({ where: { campeonatoId } });
    if (numInscritos >= campeonato.num_times && campeonato.status === 'não iniciado') {
        await campeonato.update({ status: 'em andamento' });
    }
}

// Inscrever time em um campeonato
router.post('/inscrever', async (req, res) => {
    try {
        const { timeId, campeonatoId } = req.body;
        
        // Verificar se o campeonato existe e está aberto para inscrições
        const campeonato = await Campeonato.findByPk(campeonatoId);
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        if (campeonato.status !== 'não iniciado') {
            return res.status(400).json({ error: 'Este campeonato não está aberto para inscrições' });
        }
        
        // Verificar se o time já está inscrito
        const inscricaoExistente = await TimeCampeonato.findOne({
            where: { timeId, campeonatoId }
        });
        
        if (inscricaoExistente) {
            return res.status(400).json({ error: 'Time já está inscrito neste campeonato' });
        }
        
        // Verificar se o campeonato já atingiu o número máximo de times
        const numInscricoes = await TimeCampeonato.count({
            where: { campeonatoId }
        });
        
        if (numInscricoes >= campeonato.num_times) {
            return res.status(400).json({ error: 'Campeonato já atingiu o número máximo de times' });
        }
        
        // Criar a inscrição
        await TimeCampeonato.create({
            timeId,
            campeonatoId,
            statusPagamento: 'pendente'
        });
        
        // Após inscrição, tenta atualizar o status do campeonato
        await atualizarStatusCampeonato(campeonatoId);
        
        return res.status(201).json({ message: 'Time inscrito com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao inscrever time no campeonato' });
    }
});

// Confirmar pagamento da inscrição (dono da quadra)
router.put('/confirmar-pagamento/:inscricaoId', isDonoQuadra, async (req, res) => {
    try {
        const { inscricaoId } = req.params;
        
        const inscricao = await TimeCampeonato.findByPk(inscricaoId);
        if (!inscricao) {
            return res.status(404).json({ error: 'Inscrição não encontrada' });
        }
        
        // Atualizar status do pagamento
        await TimeCampeonato.update({
            statusPagamento: 'confirmado',
            dataPagamento: new Date()
        }, {
            where: { id: inscricaoId }
        });
        
        return res.status(200).json({ message: 'Pagamento confirmado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao confirmar pagamento' });
    }
});

// Listar campeonatos em andamento
router.get('/status/em-andamento', async (req, res) => {
    try {
        const campeonatos = await Campeonato.findAll({
            where: { status: 'em andamento' },
            include: [{ model: Quadra, as: 'quadra' }]
        });

        // Mapeia para o formato esperado pelo front-end
        const campeonatosFormatados = campeonatos.map(c => ({
            id: c.id,
            title: c.nome,
            initialDate: c.data_inicio,
            premiation: c.premiacao,
            registration: c.registro,
            image: c.image || '/default-campeonato.png',
            status: c.status,
            num_teams: c.num_times,
            description: c.descricao,
            court: c.quadra || null,
            ...c.toJSON()
        }));

        return res.status(200).json(campeonatosFormatados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar campeonatos em andamento' });
    }
});

// Listar campeonatos concluídos
router.get('/status/concluidos', async (req, res) => {
    try {
        const campeonatos = await Campeonato.findAll({
            where: { status: 'finalizado' },
            include: [{ model: Quadra, as: 'quadra' }]
        });

        // Mapeia para o formato esperado pelo front-end
        const campeonatosFormatados = campeonatos.map(c => ({
            id: c.id,
            title: c.nome,
            initialDate: c.data_inicio,
            premiation: c.premiacao,
            registration: c.registro,
            image: c.image || '/default-campeonato.png',
            status: c.status,
            num_teams: c.num_times,
            description: c.descricao,
            court: c.quadra || null,
            ...c.toJSON()
        }));

        return res.status(200).json(campeonatosFormatados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar campeonatos concluídos' });
    }
});

// Buscar partidas de um campeonato
router.get('/:id/partidas', async (req, res) => {
    try {
        const { id } = req.params;

        const partidas = await Partida.findAll({
            where: { campeonatoId: id },
            include: [
                { model: Time, as: 'timeA' },
                { model: Time, as: 'timeB' }
            ],
            order: [['fase', 'ASC']]
        });

        return res.status(200).json(partidas);
    } catch (error) {
        console.error('Erro ao buscar partidas:', error);
        return res.status(500).json({ error: 'Erro ao buscar partidas do campeonato' });
    }
});

// Gerar chaves do campeonato
router.post('/:id/gerar-chaves', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Gerando chaves para o campeonato:', id);
        
        // Primeiro vamos verificar as inscrições diretamente
        const inscricoes = await TimeCampeonato.findAll({
            where: { campeonatoId: id },
            include: [{
                model: Time,
                required: true,
                attributes: ['id', 'name']
            }]
        });

        console.log('Detalhes das inscrições:', JSON.stringify(inscricoes.map(i => ({ 
            timeId: i.timeId,
            time: i.Time
        })), null, 2));
        
        console.log('Times inscritos encontrados:', inscricoes.length);
        
        // Se não houver inscrições suficientes, retorna erro
        if (inscricoes.length < 2) {
            return res.status(400).json({ 
                error: 'Número insuficiente de times para gerar chaves',
                timesInscritos: inscricoes.length
            });
        }

        // Buscar o campeonato
        const campeonato = await Campeonato.findByPk(id);

        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        //console.log(inscricoes)
        // Embaralhar os times aleatoriamente
        const times = inscricoes.map(inscricao => {
            const timeData = inscricao.dataValues.time.dataValues;
            return {
                timeId: timeData.id,
                nome: timeData.name
            };
        });
        for (let i = times.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [times[i], times[j]] = [times[j], times[i]];
        }

        // Criar as partidas iniciais
        const partidas = [];
        for (let i = 0; i < times.length; i += 2) {
            if (i + 1 < times.length) {
                const partida = await Partida.create({
                    campeonatoId: id,
                    timeAId: times[i].timeId,
                    timeBId: times[i + 1].timeId,
                    quadraId: campeonato.donoQuadraId, // usando a quadra do campeonato
                    data: campeonato.data_inicio, // Usando a data de início do campeonato
                    hora: '12:00:00', // Definindo um horário padrão
                    fase: '1',
                    status: 'agendada'
                });
                partidas.push({
                    id: partida.id,
                    timeA: times[i].nome,
                    timeB: times[i + 1].nome,
                    fase: 1,
                    status: 'agendada'
                });
            }
        }

        // Atualizar status do campeonato
        await campeonato.update({ status: 'em andamento' });

        return res.status(200).json({
            message: 'Chaves geradas com sucesso',
            partidas
        });
    } catch (error) {
        console.error('Erro ao gerar chaves:', error);
        return res.status(500).json({ error: 'Erro ao gerar chaves do campeonato' });
    }
});

// Obter tabela de artilharia de um campeonato
router.get('/:id/artilharia', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o campeonato existe
        const campeonato = await Campeonato.findByPk(id);
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
        
        // Buscar todas as partidas do campeonato
        const partidas = await Partida.findAll({
            where: { campeonatoId: id }
        });
        
        const partidaIds = partidas.map(partida => partida.id);
        
        // Buscar gols agrupados por jogador
        const gols = await Gol.findAll({
            where: { partidaId: { [Op.in]: partidaIds } },
            include: [
                { model: Usuario, as: 'jogador' },
                { model: Time }
            ],
            attributes: [
                'jogadorId',
                'timeId',
                [sequelize.fn('SUM', sequelize.col('quantidade')), 'totalGols']
            ],
            group: ['jogadorId', 'timeId'],
            order: [[sequelize.literal('totalGols'), 'DESC']]
        });
        
        return res.status(200).json(gols);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar tabela de artilharia' });
    }
});

module.exports = router;
