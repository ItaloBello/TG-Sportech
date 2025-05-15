import React from 'react'
import Header from '../../../components/Header'
import ApoointmentCard from '../../../components/AppointmentCard'
import './styles.css'

// TODO vou precisar de uma requisição que eu envie um id de agendamento ela me retorna: tipo de agendamento (Amistoso ou rachão), se for amistoso, me retorna o nome do adversário, a data,, dai ela verifica o status do agendamento e me retorna uma dessas coisas
// 	- Pagamento pendente: Ambos //quando nenhum dos dois time pagou ainda
// 	- Pagamento pendente: 'nome do time' //quando um time pagou, mas o outro não, no caso, retorne junto o nome do time
// 	- Pago //quando os dois times já pagaram
// 	- Jogado // Quando já foi realizada a partida
	

const MyAppointments = () => {
  return (
    <div className='my-appointments'>
        <Header/>
        <div className='appointment-list'>
            <ApoointmentCard type={'Amistoso'} date={'07/04/2025'} adversary={'Vila Velha'} times={['18:00-19:00']} status={"Pagamento Pendente"}/>
            <ApoointmentCard type={'Rachão'} date={'07/04/2025'} times={['18:00-19:00']} status={"Pagamento Pendente"}/>
            <ApoointmentCard type={'Rachão'} date={'07/04/2025'} times={['18:00-19:00','19:00-20:00']} status={"Jogado"}/>
        </div>
    </div>
  )
}

export default MyAppointments