import styles from './termoAtividadePratica.module.css';
import { PraticaTermo } from "@/types/PraticaTermo";
import DescriptionRender from "@/components/DescriptionRender";
import { VerticalStepper } from "../vertical-stepper/verticalStepper";
import React, { useEffect, useState } from "react";
import { Pratica } from "@/types/Pratica";
import PraticaDialog from "@/components/pratica-dialog/praticaDialog";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

type TermoAtividadePraticaProps = {
  praticaTermo: PraticaTermo
  praticaTermos: PraticaTermo[]
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
}

export const TermoAtividadePratica = ({
                                        praticaTermo,
                                        praticaTermos,
                                        getIconTermoPratica,
                                        setOpenAccordion
                                      }: TermoAtividadePraticaProps) => {

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

const DescricaoTermoAtividadePratica = ({
                                          praticaTermo,
                                          praticaTermos,
                                          getIconTermoPratica,
                                          setOpenAccordion
                                        }: TermoAtividadePraticaProps) => {
   const [isPraticaAcessaModalOpen, setIsPraticaAcessaModalOpen] = useState(false)
   const [praticaAcessa, setPraticaAcessa] = useState<Pratica | null>(null)

   const accessPratica = async (praticaUri: string) => {

      const queryParams = new URLSearchParams({praticaUri: `<${praticaUri}>` ?? ''}).toString()

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/pratica?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json()
        setPraticaAcessa({...data, uri: data.uri.replace(/[<>]/g, "")});
      }
  }

  useEffect(() => {
    if (praticaTermo.termoPraticaAcessa){
      accessPratica(praticaTermo.termoPraticaAcessa);
    }
  }, [praticaTermo.termoPraticaAcessa]);

  const splitTermoAtividadePraticaProduz = (termoPraticaProduz: string) => {
    return termoPraticaProduz.split("|");
  }

  const findTermoAtividadePraticaProduzInTermos = (termosProduz: string[]): PraticaTermo[] => {
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

      {praticaAcessa && (
        <>
          <p className={styles.produzTitleContainer}>
            <span className={styles.produzTitle}>Acessa</span>
          </p>

          <div className={styles.produzTermos} onClick={() => setIsPraticaAcessaModalOpen((prevState) => !prevState)}>
            <AutoStoriesIcon/>
            <DescriptionRender description={praticaAcessa.nome ?? ""}/>
          </div>
        </>
      )
      }

      {isPraticaAcessaModalOpen && (
        <PraticaDialog
          praticaSelecionada={praticaAcessa}
          setPraticaSelecionada={() => null}
          setIsPraticaModalOpen={setIsPraticaAcessaModalOpen}
          isPraticaModalOpen={isPraticaAcessaModalOpen}
        />
      )}
    </div>
  )
}