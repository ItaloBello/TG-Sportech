import React, { useEffect, useState } from "react";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import "./styles.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Header from "../../../components/Header";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useParams } from "react-router-dom";
import { notifySuccess, notifyError } from "../../../utils/notify";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
  })
  .required();

const ViewTeam = () => {
  const { teamId } = useParams(); // Obtém o ID do time da URL
  const { 
    player, 
    handleGetTeamDetails, 
    selectedTeam, 
    teamPlayers, 
    isTeamOwner,
    handleRemovePlayerFromTeam 
  } = usePlayerAuth();
  
  const [loading, setLoading] = useState(true);
  
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    let isMounted = true;
    const loadTeamDetails = async () => {
      if (teamId && player?.id) {
        setLoading(true);
        try {
          const data = await handleGetTeamDetails(teamId);
          if (data && data.time && isMounted) {
            // Preenche o formulário com os dados do time
            setValue('name', data.time.name);
            setValue('primaryColor', data.time.primaryColor || data.time.cor_primaria);
            setValue('secondaryColor', data.time.secondaryColor || data.time.cor_secundaria);
          }
        } catch (error) {
          console.error('Erro ao carregar detalhes do time:', error);
          if (isMounted) {
            notifyError('Não foi possível carregar os detalhes do time');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    loadTeamDetails();
    
    return () => {
      isMounted = false;
    };
  }, [teamId, player?.id]);

  const handleRemovePlayer = (playerId) => {
    if (window.confirm('Tem certeza que deseja remover este jogador do time?')) {
      handleRemovePlayerFromTeam(teamId, playerId);
    }
  };

  if (loading) {
    return (
      <div className="view-team">
        <Header link={1}/>
        <div className="view-team__loading">Carregando detalhes do time...</div>
      </div>
    );
  }

  return (
    <div className="view-team">
      <Header link={1}/>
      <div className="view-team__header">
        <p>{selectedTeam?.name || 'Time'}</p>
        {selectedTeam?.img && (
          <img
            src={selectedTeam.img}
            alt={`Logo do time ${selectedTeam.name}`}
            className="view-team__logo"
          />
        )}
        {!selectedTeam?.img && (
          <img
            src="../../../public/add-img-team.png"
            alt="imagem padrão do time"
            className="view-team__logo"
          />
        )}
      </div>
      
      <form>
        <InputItem
          label="Nome do Time"
          placeholder="Time"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
          isDisabled={true}
        />
        <InputItem
          label="Cor Primária"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.primaryColor?.message}
          name="primaryColor"
          isDisabled={true}
        />
        <InputItem
          label="Cor Secundária"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.secondaryColor?.message}
          name="secondaryColor"
          isDisabled={true}
        />
        
        {selectedTeam && (
          <div className="view-team__code-section">
            <p className="view-team__code-label">Código de convite:</p>
            <p className="view-team__code-value">{selectedTeam.inviteCode}</p>
          </div>
        )}
        
        <div className="view-team__players-section">
          <h3>Jogadores do Time</h3>
          {teamPlayers && teamPlayers.length > 0 ? (
            <ul className="view-team__players-list">
              {teamPlayers.map((jogador) => (
                <li key={jogador.id} className="view-team__player-item">
                  <div className="view-team__player-info">
                    <p className="view-team__player-name">{jogador.name}</p>
                    <p className="view-team__player-email">{jogador.email}</p>
                    {jogador.cellphone && (
                      <p className="view-team__player-phone">{jogador.cellphone}</p>
                    )}
                  </div>
                  {isTeamOwner && jogador.id !== player.id && (
                    <button 
                      type="button" 
                      className="view-team__remove-player" 
                      onClick={() => handleRemovePlayer(jogador.id)}
                    >
                      Remover
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="view-team__no-players">Nenhum jogador encontrado neste time.</p>
          )}
        </div>
        
        <div className="view-team__button-area">
          <ButtonItem label="Voltar" link="/player/show-team" />
          {isTeamOwner && (
            <ButtonItem label="Editar Time" link={`/player/edit-team/${teamId}`} />
          )}
        </div>
      </form>
    </div>
  );
};

export default ViewTeam;
