import { PraticaTermo } from "@/types/PraticaTermo"
import { VerticalStepper } from "@/components/vertical-stepper/verticalStepper";
import DescriptionRender from "@/components/DescriptionRender";
import React from "react";
import styles from "@/components/termo-produto-pratica/termoProdutoPratica.module.css";

type TermoProdutoPraticaProps = {
  praticaTermo: PraticaTermo
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
}

export const TermoProdutoPratica = ({
                                      praticaTermo,
                                      getIconTermoPratica,
                                      setOpenAccordion
                                    }: TermoProdutoPraticaProps) => {

  const getSteps = (): { label: string, description: React.JSX.Element }[] => {
    let steps: { label: string, description: React.JSX.Element }[] = [
      {
        label: 'Descrição',
        description: <DescricaoTermoProdutoPratica descricao={praticaTermo.termoPraticaDescricao ?? ''}
                                                   getIconTermoPratica={getIconTermoPratica}
                                                   setOpenAccordion={setOpenAccordion}
                                                   organizadoPor={praticaTermo.organizadoPor}
                                                   produzidoPor={praticaTermo.produzidoPor}/>
      },
    ]

    if (praticaTermo.passosElementos && praticaTermo.passosElementos.length !== 0) {
      const passosElementosOrdenados = praticaTermo.passosElementos.map(passoElemento => {
        return {
          ...passoElemento,
          ordem: parseInt(stripHtml(passoElemento.ordem))
        }
      }).sort((a, b) => a.ordem - b.ordem)


      steps = steps.concat(passosElementosOrdenados.map(passoElemento => {
        return {
          label: stripHtml(passoElemento.nome),
          description: <DescricaoTermoProdutoPratica descricao={passoElemento.descricao ?? ''}
                                                     praticaTermos={passoElemento.termosPratica}
                                                     getIconTermoPratica={getIconTermoPratica}
                                                     setOpenAccordion={setOpenAccordion}/>
        }
      }))
    }

    return steps
  }

  const stripHtml = (html: string): string => {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(html, 'text/html');
    return parsedDocument.body.textContent ?? "";
  }

  return (
    <div>
      <VerticalStepper steps={getSteps()}/>
    </div>
  )
}

type DescricaoTermoProdutoPraticaProps = {
  descricao: string
  praticaTermos?: PraticaTermo[]
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
  organizadoPor?: PraticaTermo[]
  produzidoPor?: PraticaTermo[]
}

const DescricaoTermoProdutoPratica = ({
                                        descricao,
                                        praticaTermos,
                                        getIconTermoPratica,
                                        setOpenAccordion,
                                        organizadoPor,
                                        produzidoPor
                                      }: DescricaoTermoProdutoPraticaProps) => {
  return (
    <div>
      <DescriptionRender description={descricao}/>

      {organizadoPor && organizadoPor?.length !== 0 && (
        <p className={styles.produzTitleContainer}>
          <span className={styles.produzTitle}>Organizado por</span>
        </p>
      )}

      {organizadoPor?.map(praticaTermo => {
        return (
          <div key={praticaTermo.termoPraticaUri} className={styles.produzTermos}
               onClick={() => setOpenAccordion(praticaTermo.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermo, 24)}
            <DescriptionRender description={praticaTermo.termoPraticaNome ?? ""}/>
          </div>
        )
      })}

      {produzidoPor && produzidoPor?.length !== 0 && (
        <p className={styles.produzTitleContainer}>
          <span className={styles.produzTitle}>Produzido por</span>
        </p>
      )}

      {produzidoPor?.map(praticaTermo => {
        return (
          <div key={praticaTermo.termoPraticaUri} className={styles.produzTermos}
               onClick={() => setOpenAccordion(praticaTermo.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermo, 24)}
            <DescriptionRender description={praticaTermo.termoPraticaNome ?? ""}/>
          </div>
        )
      })}

      {praticaTermos && praticaTermos?.length !== 0 && (
        <p className={styles.produzTitleContainer}>
          <span className={styles.produzTitle}>Atendido por</span>
        </p>
      )}

      {praticaTermos?.map(praticaTermo => {
        return (
          <div key={praticaTermo.termoPraticaUri} className={styles.produzTermos}
               onClick={() => setOpenAccordion(praticaTermo.termoPraticaUri)}>
            {getIconTermoPratica(praticaTermo, 24)}
            <DescriptionRender description={praticaTermo.termoPraticaNome ?? ""}/>
          </div>
        )
      })}
    </div>
  )
}