import { Frequencia } from "@/enums/Frequencia";
import { Impacto } from "@/enums/Impacto";
import { GrauRelevancia } from "@/enums/GrauRelevancia";
import { Causa } from "@/types/Causa";

export type Consequencia = {
  nome: string;
  uri: string;
  descricao?: string;
  frequencia?: Frequencia;
  impacto?: Impacto;
  grauRelevancia?: GrauRelevancia;
  causas?: Causa[];
}