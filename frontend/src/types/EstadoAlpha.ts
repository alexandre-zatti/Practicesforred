import { PraticaTermo } from "@/types/PraticaTermo";

export type EstadoAlpha = {
  uri: string;
  nome: string;
  descricao: string;
  ordem: string;
  termosPratica: PraticaTermo[];
}