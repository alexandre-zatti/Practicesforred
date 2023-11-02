import { GrauRelevancia } from "@/enums/GrauRelevancia";
import { Classificacao } from "@/enums/Classificacao";

export type Pratica = {
  uri: string;
  nome: string;
  descricao: string;
  fluxoAtividades: string;
  apresentacao: string;
  introducao: string;
  quandoAplicar: string;
  referencias: string;
  classificacao: Classificacao;
  grauRelevancia?: GrauRelevancia;
}