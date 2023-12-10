import { EstadoAlpha } from "@/types/EstadoAlpha";
import { PassoElemento } from "@/types/PassoElemento";

export type PraticaTermo = {
  termoPraticaNome: string;
  termoPraticaOrdem: number;
  termoPraticaTipo: string;
  termoPraticaUri: string;
  termoPraticaProduz?: string;
  termoPraticaDescricao?: string;
  termoPraticaApresentacao?: string;
  termoPraticaInformacoesAdicionais?: string;
  termoPraticaAbordagens?: string;
  estadosAlpha?: EstadoAlpha[];
  passosElementos?: PassoElemento[];
  termosPratica?: PraticaTermo[];
  produzidoPor?: PraticaTermo[];
  organizadoPor?: PraticaTermo[];
  contempla?: PraticaTermo[];
}