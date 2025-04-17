import * as yup from "yup";

export const chargingPointSchema = yup.object().shape({
  nome: yup.string().required("Nome do ponto é obrigatório"),
  endereco: yup.string().required("Endereço completo é obrigatório"),
  tipoRecarga: yup
    .string()
    .required("Tipo de recarga é obrigatório"),
  status: yup.boolean().required("Status é obrigatório"),
  horarioFuncionamento: yup
    .string()
    .required("Horário de funcionamento é obrigatório"),
  responsavelNome: yup.string().required("Nome do responsável é obrigatório"),
  responsavelContato: yup
    .string()
    .required("Contato do responsável é obrigatório"),
});
