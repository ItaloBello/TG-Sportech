import React from "react";
//TODO integrar aqui
const RegisterEstab = () => {
  return (
    <div>
      <Header />
      <p>Dados do Estabelecimento</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputItem
          label="Nome do Estabelecimento"
          placeholder="Estabelecimento"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
        />
        <InputItem
          label="CEP"
          placeholder="CEP"
          control={control}
          errorMessage={errors?.email?.message}
          name="cep"
        />
        <InputItem
          label="Rua"
          placeholder="Rua"
          control={control}
          errorMessage={errors?.cellphone?.message}
          name="Street"
        />
        <InputItem
          label="Número"
          placeholder="Número"
          control={control}
          errorMessage={errors?.cpf?.message}
          name="number"
        />
        <InputItem
          label="Cidade/Estado"
          placeholder="Cidade/Estado"
          control={control}
          errorMessage={errors?.password?.message}
          name="city"
        />
        <InputItem
          label="Início do Funcionamento"
          placeholder="Início do Funcionamento"
          control={control}
          errorMessage={errors?.confirmPassword?.message}
          name="initial"
        />
        <InputItem
          label="Fim do Funcionamento"
          placeholder="Fim do Funcionamento"
          control={control}
          errorMessage={errors?.confirmPassword?.message}
          name="end"
        />

        <FormButton label="Cadastrar" />
      </form>
      
    </div>
  );
};

export default RegisterEstab;
