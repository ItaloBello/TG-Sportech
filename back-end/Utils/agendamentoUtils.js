const Agendamento = require("../Models/Agendamentos");
const Horario = require("../Models/Horarios");
const Quadra = require("../Models/Quadra");

const dias = {"domingo": 0, "segunda": 1, "terça": 2, "quarta": 3, "quinta": 4, "sexta": 5, "sabado":6}
const arrayDias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sabado"]
function getCadastrados(horarios){
    let cadastrados = [];
    for(hor of horarios){
        cadastrados.push(dias[hor.diaSemana])
    }
    return cadastrados
}

function timeStringToDecimal(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
}

function decimalToTimeString(decimal) {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function getDaySlots(data, idQuadra, unavailableSlots) {
    console.log(`getDaySlots chamado para: data=${data} (${data.toISOString()}), idQuadra=${idQuadra}`);
    
    const quadra = await Quadra.findOne({where: {id: idQuadra}});
    if (!quadra) {
        console.log(`Quadra ${idQuadra} não encontrada`);
        return [];
    }
    
    // Identifica o dia da semana
    const diaSemana = arrayDias[data.getDay()];
    console.log(`Dia da semana identificado: ${diaSemana} (dia ${data.getDay()})`);
    
    if (diaSemana === undefined) {
        // Proteção extra: se diaSemana for undefined, retorna slots vazios para evitar erro do Sequelize
        console.log('Dia da semana indefinido!');
        return [];
    }
    
    // Busca horário configurado para essa quadra nesse dia da semana
    const horario = await Horario.findOne({where: {quadraId: parseInt(idQuadra), diaSemana: diaSemana}});
    
    if(!horario){
        console.log(`Nenhum horário encontrado para quadra ${idQuadra} no dia ${diaSemana}`);
        return [];
    }
    
    console.log(`Horário encontrado: ${JSON.stringify(horario)}`);

    let tempoInicial = timeStringToDecimal(horario.horaInicio);
    let tempoFinal = timeStringToDecimal(horario.horaFim);
    let contador = tempoInicial;
    let slots = [];
    let intervalo = quadra.meioSlot ? 0.5 : 1;

    const unavailableMap = new Map(unavailableSlots.map(slot => [slot, true]));

    while (contador < tempoFinal) {
        const slotStart = decimalToTimeString(contador);
        const slotEnd = decimalToTimeString(contador + intervalo);
        const slotString = `${slotStart}-${slotEnd}`;

        if (!unavailableMap.has(slotString)) {
            slots.push(slotString);
        }

        contador += intervalo;
    } 

    return slots;
}

module.exports = {
    getDaySlots,
    getCadastrados
};
