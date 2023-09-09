import { GrauRelevancia } from "@/enums/GrauRelevancia";

export type Causa = {
  nome: string;
  uri: string;
  descricao?: string;
  grauRelevancia?: GrauRelevancia;
  uriConsequencia?: string;
}