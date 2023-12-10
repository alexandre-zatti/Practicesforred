import { PraticaTermo } from "@/types/PraticaTermo"
import DescriptionRender from "@/components/DescriptionRender";
import React from "react";
import styles from "@/components/termo-espaco-atividade-pratica/termoEspacoAtividadePratica.module.css"

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
               onClick={() => setOpenAccordion(praticaTermoProduz.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermoProduz, 24)}
            <DescriptionRender description={praticaTermoProduz.termoPraticaNome ?? ""}/>
          </div>
        )
      })}
    </div>
  )
}