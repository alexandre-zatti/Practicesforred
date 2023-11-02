import styles from './termoAtividadePratica.module.css';
import { PraticaTermo } from "@/types/PraticaTermo";
import DescriptionRender from "@/components/DescriptionRender";
import { VerticalStepper } from "../vertical-stepper/verticalStepper";
import React from "react";

type TermoAtividadePraticaProps = {
  praticaTermo: PraticaTermo
  praticaTermos: PraticaTermo[]
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
}

export const TermoAtividadePratica = ({praticaTermo, praticaTermos, getIconTermoPratica, setOpenAccordion}: TermoAtividadePraticaProps) => {

  const steps = [
    {
      label: 'Descrição',
      description: <DescricaoTermoAtividadePratica praticaTermo={praticaTermo}
                                                   praticaTermos={praticaTermos}
                                                   getIconTermoPratica={getIconTermoPratica}
                                                   setOpenAccordion={setOpenAccordion}/>,
    },
    {
      label: 'Apresentação',
      description: <DescriptionRender description={praticaTermo.termoPraticaApresentacao ?? ""}/>,
    },
    {
      label: 'Abordagens',
      description: <DescriptionRender description={praticaTermo.termoPraticaAbordagens ?? ""}/>,
    },
    {
      label: 'Informações Adicionais',
      description: <DescriptionRender description={praticaTermo.termoPraticaInformacoesAdicionais ?? ""}/>,
    }
  ];

  return (
    <div>
      <VerticalStepper steps={steps}/>
    </div>
  )
}

const DescricaoTermoAtividadePratica = ({praticaTermo, praticaTermos, getIconTermoPratica, setOpenAccordion}: TermoAtividadePraticaProps) => {

  const splitTermoAtividadePraticaProduz = (termoPraticaProduz: string) => {
    console.log(termoPraticaProduz.split("|"))
    return termoPraticaProduz.split("|");
  }

  const findTermoAtividadePraticaProduzInTermos = (termosProduz: string[]): PraticaTermo[] => {
    console.log(praticaTermos.filter(praticaTermo => termosProduz.includes(praticaTermo.termoPraticaUri)))
    return praticaTermos.filter(praticaTermo => termosProduz.includes(praticaTermo.termoPraticaUri));
  }

  return (
    <div>
      <DescriptionRender description={praticaTermo.termoPraticaDescricao ?? ""}/>

      <p className={styles.produzTitleContainer}>
        <span className={styles.produzTitle}>Produz</span>
      </p>

      {findTermoAtividadePraticaProduzInTermos(splitTermoAtividadePraticaProduz(praticaTermo.termoPraticaProduz ?? "")).map(praticaTermoProduz => {
        return (
          <div key={praticaTermoProduz.termoPraticaUri} className={styles.produzTermos}
               onClick={() => setOpenAccordion(praticaTermoProduz.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermoProduz, 24)}
            <DescriptionRender description={praticaTermoProduz.termoPraticaNome ?? ""}/>
          </div>
        )
      })}
    </div>
  )
}