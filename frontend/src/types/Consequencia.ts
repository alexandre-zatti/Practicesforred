import { Frequencia } from "@/enums/Frequencia";
import { Impacto } from "@/enums/Impacto";
import { GrauRelevancia } from "@/enums/GrauRelevancia";

export type Consequencia = {
  nome: string;
  uri: string;
  descricao: string;
  frequencia?: Frequencia;
  impacto?: Impacto;
  grauRelevancia?: GrauRelevancia;
}