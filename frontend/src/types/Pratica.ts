import { GrauRelevancia } from "@/enums/GrauRelevancia";
import { Classificacao } from "@/enums/Classificacao";

export type Pratica = {
  uri: string;
  nome: string;
  descricao: string;
  classificacao: Classificacao;
  grauRelevancia?: GrauRelevancia;
}