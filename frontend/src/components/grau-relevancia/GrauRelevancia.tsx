import React, { JSXElementConstructor, ReactElement } from "react";
import { CrisisAlertOutlined, InfoOutlined, WarningAmberOutlined } from "@mui/icons-material";
import styles from "./GrauRelevancia.module.css";
import { Chip } from "@mui/material";
import { GrauRelevancia as GrauRelevanciaEnum } from "@/enums/GrauRelevancia";

interface GrauRelevanciaProps {
  grauRelevancia: GrauRelevanciaEnum
}

const GrauRelevancia = ({grauRelevancia}: GrauRelevanciaProps) => {
  const getGrauRelevanciaIcon = (grauRelevancia: number): ReactElement<any, string | JSXElementConstructor<any>> | undefined => {

    switch (grauRelevancia) {
      case GrauRelevanciaEnum.BAIXO:
        return <InfoOutlined style={{color: "dodgerblue"}}/>
      case GrauRelevanciaEnum.MEDIO:
        return <WarningAmberOutlined style={{color: "yellowgreen"}}/>
      case GrauRelevanciaEnum.ALTO:
        return <CrisisAlertOutlined style={{color: "red"}}/>
      default:
        return <></>
    }
  }

  const getGrauRelevanciaNomeStyle = (grauRelevancia: number): string => {

    switch (grauRelevancia) {
      case GrauRelevanciaEnum.BAIXO:
        return styles.grauRelevanciaNomeBaixo
      case GrauRelevanciaEnum.MEDIO:
        return styles.grauRelevanciaNomeMedio
      case GrauRelevanciaEnum.ALTO:
        return styles.grauRelevanciaNomeAlto
      default:
        return ''
    }
  }


  return (
    <Chip
      className={styles.grauRelevanciaChip}
      icon={getGrauRelevanciaIcon(grauRelevancia)}
      label={
        <span className={getGrauRelevanciaNomeStyle(grauRelevancia)}>
          {GrauRelevanciaEnum[grauRelevancia] === 'MEDIO' ? 'MÉDIO' : GrauRelevanciaEnum[grauRelevancia]}
        </span>
      }
      variant="outlined"
    />
  )
}

export default GrauRelevancia;