import React, { useEffect, useState } from "react";
import "./styles.css";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { api } from "../../../services/api";
import { notifySuccess, notifyError } from "../../../utils/notify";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
  })
  .required();

const EditTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { player, handleGetTeamDetails, selectedTeam, teamPlayers, isTeamOwner } = usePlayerAuth();
  const [loading, setLoading] = useState(true);
  
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    let isMounted = true;
    const loadTeamData = async () => {
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
          console.error('Erro ao carregar dados do time:', error);
          if (isMounted) {
            notifyError('Não foi possível carregar os dados do time');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    loadTeamData();
    
    return () => {
      isMounted = false;
    };
  }, [teamId, player?.id, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/api/jogador/times/${teamId}`, {
        nome: data.name,
        cor_primaria: data.primaryColor,
        cor_secundaria: data.secondaryColor
      });
      notifySuccess('Time atualizado com sucesso!');
      setTimeout(() => {
        navigate('/player/show-team');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
      notifyError(error.response?.data?.error || 'Erro ao atualizar time');
    }
  };
  
  const handleRemovePlayer = async (playerId) => {
    if (window.confirm('Tem certeza que deseja remover este jogador do time?')) {
      try {
        await api.delete('/api/jogador/remover', { 
          data: { timeId: teamId, jogadorId: playerId } 
        });
        notifySuccess('Jogador removido do time com sucesso!');
        // Recarrega os dados do time
        handleGetTeamDetails(teamId);
      } catch (error) {
        notifyError(error.response?.data?.error || 'Erro ao remover jogador do time');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="edit-team">
        <Header link={1}/>
        <div className="edit-team__loading">Carregando dados do time...</div>
      </div>
    );
  }
  
  // Redireciona se não for o dono do time
  if (!isTeamOwner && !loading) {
    notifyError('Apenas o dono do time pode editá-lo');
    setTimeout(() => {
      navigate('/player/show-team');
    }, 2000);
    return null;
  }

  return (
    <div className="edit-team">
      <Header link={1}/>
      <div className="edit-team__header">
        <p>Editar Time</p>
        <img
          src="../../../public/add-img-team.png"
          alt="adicione a imagem time"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputItem
          label="Nome do Time"
          placeholder="Time"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
        />
        <InputItem
          label="Cor Primária"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.primaryColor?.message}
          name="primaryColor"
        />
        <InputItem
          label="Cor Secundária"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.secondaryColor?.message}
          name="secondaryColor"
        />
        <div className="edit-team__button-area">
          <ButtonItem
            label="Cancelar"
            link="/player/show-team"
            color="#EC221F"
          />
          <FormButton label="Salvar" />
        </div>
      </form>
      
      <div className="edit-team__players-table">
        <div className="players-table__header">
          <p>Jogadores</p>
        </div>
        {teamPlayers && teamPlayers.length > 0 ? (
          teamPlayers.map((jogador) => (
            <div className="players-table__row" key={jogador.id}>
              <div className="row__name-area">
                <span>{jogador.name}</span>
                {jogador.id === player.id && <span className="captain-badge">C</span>}
              </div>
              {jogador.id !== player.id && (
                <button 
                  onClick={() => handleRemovePlayer(jogador.id)} 
                  className="row__button"
                >
                  X
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="players-table__empty">Nenhum jogador encontrado</div>
        )}
      </div>
    </div>
  );
};

export default EditTeam;
