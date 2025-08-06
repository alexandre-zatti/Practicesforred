'use client'

import styles from './page.module.css'
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { ArrowForwardOutlined } from "@mui/icons-material";

const Home = () => {
  return (
    <div className={styles.container}>

      <div className={styles.titleContainer}>
        <div className={styles.titlePrimaryContainer}>
          <Typography variant={'h1'} className={`${styles.title} ${styles.titlePrimary}`}>
            PracticesforReD
          </Typography>
        </div>

        <div className={`${styles.titleSecondary}`}>
          <Typography variant={'h5'}>
            Abordagem de recomendação de práticas para mitigar e prevenir dívidas de requisitos em organizações ágeis
          </Typography>
        </div>

        <div className={styles.buttonsContainer}>
          <Button variant={'contained'} className={styles.button}>
            <Link href={'/analise'}>Iniciar</Link>
            <ArrowForwardOutlined className={styles.buttonArrow}/>
          </Button>
        </div>
      </div>
    </div>

  )
}
export default Home