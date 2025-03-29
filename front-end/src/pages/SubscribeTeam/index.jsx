import React from "react";
import Header from "../../components/Header";
import ChampDescription from "../../components/ChampDescription";
import "./styles.css";
const SubscribeTeam = () => {
  return (
    <div className="subscribe-team">
      <Header />
      <ChampDescription
        description="A Copa Zona Norte será um competição realizada em nossa
          quadra Amigos da Bola, localizada na Av. Ipanema, 800. Os jogos do
          meio de semana serão realizados de noite já durante o fim de semana
          serão na parte da manhã. Traga a família para acompanhar os jogos e
          desfrutar de nosso espaço!"
          title="Copa Zona Norte"
          finalDate=""
          initialDate=""
          numberPlayers="9"
          registration="R$40,00"
      />
    </div>
  );
};

export default SubscribeTeam;
