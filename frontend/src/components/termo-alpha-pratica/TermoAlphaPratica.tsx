import { PraticaTermo } from "@/types/PraticaTermo"
import { VerticalStepper } from "@/components/vertical-stepper/verticalStepper";
import DescriptionRender from "@/components/DescriptionRender";
import React, { useState } from "react";
import styles from "@/components/termo-alpha-pratica/termoAlphaPratica.module.css";
import { Pratica } from "@/types/Pratica";
import PraticaDialog from "@/components/pratica-dialog/praticaDialog";

type TermoAlphaPraticaProps = {
  praticaTermo: PraticaTermo
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
}

export const TermoAlphaPratica = ({
                                    praticaTermo,
                                    getIconTermoPratica,
                                    setOpenAccordion
                                  }: TermoAlphaPraticaProps) => {

  const getSteps = (): { label: string, description: React.JSX.Element }[] => {
    let steps: { label: string, description: React.JSX.Element }[] = [
      {
        label: 'Apresentação',
        description: <DescricaoTermoAlphaPratica descricao={praticaTermo.termoPraticaDescricao ?? ''}
                                                 praticaTermos={praticaTermo.termosPratica ?? []}
                                                 getIconTermoPratica={getIconTermoPratica}
                                                 setOpenAccordion={setOpenAccordion} title={'Progredido por'}/>
      },
    ]

    if (praticaTermo.estadosAlpha && praticaTermo.estadosAlpha.length !== 0) {
      const estadosAlphaOrdenados = praticaTermo.estadosAlpha.map(estadoAlpha => {
        return {
          ...estadoAlpha,
          ordem: parseInt(stripHtml(estadoAlpha.ordem))
        }
      }).sort((a, b) => a.ordem - b.ordem)


      steps = steps.concat(estadosAlphaOrdenados.map(estadoAlpha => {
        return {
          label: stripHtml(estadoAlpha.nome),
          description: <DescricaoTermoAlphaPratica descricao={estadoAlpha.descricao ?? ''}
                                                   praticaTermos={estadoAlpha.termosPratica ?? []}
                                                   getIconTermoPratica={getIconTermoPratica}
                                                   setOpenAccordion={setOpenAccordion} title={'Avançado por'}/>
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

type DescricaoTermoAlphaPraticaProps = {
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
                                    }: DescricaoTermoAlphaPraticaProps) => {

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