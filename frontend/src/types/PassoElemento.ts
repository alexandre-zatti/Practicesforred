import { PraticaTermo } from "@/types/PraticaTermo";

export type PassoElemento = {
  uri: string;
  nome: string;
  descricao: string;
  ordem: string;
  termosPratica: PraticaTermo[];
}