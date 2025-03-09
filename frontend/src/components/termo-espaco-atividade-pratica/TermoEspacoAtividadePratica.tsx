import { PraticaTermo } from "@/types/PraticaTermo"
import DescriptionRender from "@/components/DescriptionRender";
import React, { useEffect, useState } from "react";
import styles from "@/components/termo-espaco-atividade-pratica/termoEspacoAtividadePratica.module.css"
import { Pratica } from "@/types/Pratica";
import PraticaDialog from "@/components/pratica-dialog/praticaDialog";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "@/store/LoadingSlice";

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
  return (
    <div className={styles.container}>
      <DescricaoTermoAlphaPratica descricao={praticaTermo.termoPraticaDescricao ?? ''}
                                  praticaTermo={praticaTermo}
                                  praticaTermos={praticaTermo.contempla ?? []}
                                  getIconTermoPratica={getIconTermoPratica}
                                  setOpenAccordion={setOpenAccordion} title={'Contempla'}/>
    </div>
  )
}

type DescricaoTermoEspacoAtividadePraticaProps = {
  descricao: string
  praticaTermo: PraticaTermo
  praticaTermos: PraticaTermo[]
  getIconTermoPratica: (praticaTermo: PraticaTermo, size?: number) => React.JSX.Element | undefined
  setOpenAccordion: (openAccordion: string) => void
  title: string
}

const DescricaoTermoAlphaPratica = ({
                                      descricao,
                                      praticaTermo,
                                      praticaTermos,
                                      getIconTermoPratica,
                                      setOpenAccordion,
                                      title
                                    }: DescricaoTermoEspacoAtividadePraticaProps) => {
  const dispatch = useDispatch()
   const [isPraticaModalOpen, setIsPraticaModalOpen] = useState(false)
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
      dispatch(showLoading())
      accessPratica(praticaTermo.termoPraticaAcessa).finally(() => dispatch(hideLoading()));
    }
  }, [praticaTermo.termoPraticaAcessa]);

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

      {praticaAcessa && (
        <>
          <p className={styles.produzTitleContainer}>
            <span className={styles.produzTitle}>Acessa</span>
          </p>

          <div className={styles.produzTermos} onClick={() => setIsPraticaModalOpen((prevState) => !prevState)}>
            <AutoStoriesIcon/>
            <DescriptionRender description={praticaAcessa.nome ?? ""}/>
          </div>
        </>
      )}

      {isPraticaModalOpen && (
        <PraticaDialog
          praticaSelecionada={praticaAcessa}
          setPraticaSelecionada={() => null}
          setIsPraticaModalOpen={setIsPraticaModalOpen}
          isPraticaModalOpen={isPraticaModalOpen}
        />
      )}
    </div>
  )
}