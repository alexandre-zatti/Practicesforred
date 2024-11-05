import { PraticaTermo } from "@/types/PraticaTermo"
import DescriptionRender from "@/components/DescriptionRender";
import React, { useState } from "react";
import styles from "@/components/termo-espaco-atividade-pratica/termoEspacoAtividadePratica.module.css"
import { Pratica } from "@/types/Pratica";
import PraticaDialog from "@/components/pratica-dialog/praticaDialog";

type TermoEspacoAtividadePraticaProps = {
  praticaTermo: PraticaTermo
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
}

export const TermoEspacoAtividadePratica = ({
                                              praticaTermo,
                                              getIconTermoPratica,
                                              setOpenAccordion
                                            }: TermoEspacoAtividadePraticaProps) => {

  // const getSteps = (): { label: string, description: React.JSX.Element }[] => {
  //   let steps: { label: string, description: React.JSX.Element }[] = [
  //     {
  //       label: 'Descrição',
  //       description: <DescricaoTermoAlphaPratica descricao={praticaTermo.termoPraticaDescricao ?? ''}
  //                                                praticaTermos={praticaTermo.contempla ?? []}
  //                                                getIconTermoPratica={getIconTermoPratica}
  //                                                setOpenAccordion={setOpenAccordion} title={'Contempla'}/>
  //     },
  //   ]
  //
  //   return steps
  // }

  return (
    <div className={styles.container}>
      <DescricaoTermoAlphaPratica descricao={praticaTermo.termoPraticaDescricao ?? ''}
                                  praticaTermos={praticaTermo.contempla ?? []}
                                  getIconTermoPratica={getIconTermoPratica}
                                  setOpenAccordion={setOpenAccordion} title={'Contempla'}/>
    </div>
  )
}

type DescricaoTermoEspacoAtividadePraticaProps = {
  descricao: string
  praticaTermos: PraticaTermo[]
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
  title: string
}

const DescricaoTermoAlphaPratica = ({
                                      descricao,
                                      praticaTermos,
                                      getIconTermoPratica,
                                      setOpenAccordion,
                                      title
                                    }: DescricaoTermoEspacoAtividadePraticaProps) => {

   const [isPraticaModalOpen, setIsPraticaModalOpen] = useState(false)
   const [praticaSelecionada, setPraticaSelecionada] = useState<Pratica | null>(null)

   const accessPratica = async (praticaUri: string) => {

      const queryParams = new URLSearchParams({praticaUri: `<${praticaUri}>` ?? ''}).toString()

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/pratica?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json()
        setPraticaSelecionada({...data, uri: data.uri.replace(/[<>]/g, "")});
        setIsPraticaModalOpen(true);
      }
  }

  return (
    <div>
      <DescriptionRender description={descricao}/>

      {praticaTermos.length !== 0 && (
        <p className={styles.produzTitleContainer}>
          <span className={styles.produzTitle}>{title}</span>
        </p>
      )}

      {praticaTermos.map(praticaTermoProduz => {
        return (
          <div key={praticaTermoProduz.termoPraticaUri} className={styles.produzTermos}
               onClick={praticaTermoProduz.termoPraticaAcessa ?
                 () => accessPratica(praticaTermoProduz.termoPraticaAcessa!) :
                 () => setOpenAccordion(praticaTermoProduz.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermoProduz, 24)}
            <DescriptionRender description={praticaTermoProduz.termoPraticaNome ?? ""}/>
          </div>
        )
      })}

      {isPraticaModalOpen && (
        <PraticaDialog
          praticaSelecionada={praticaSelecionada}
          setPraticaSelecionada={setPraticaSelecionada}
          setIsPraticaModalOpen={setIsPraticaModalOpen}
          isPraticaModalOpen={isPraticaModalOpen}
        />
      )}
    </div>
  )
}