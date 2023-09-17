'use client'

import styles from './page.module.css'
import { Button, Typography } from "@mui/material";
import Link from "next/link";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Typography variant={'h1'}>Dívida de requisitos</Typography>
        <Typography variant={'h1'} className={styles.titleSecondary}>Gap Analysis v2</Typography>
      </div>

      <div className={styles.buttonsContainer}>
        <Button variant={'contained'} className={styles.button}>
          <Link href={'/analise'}>Iniciar análise</Link>
        </Button>
        <Button variant={'outlined'} className={styles.button}>Sobre</Button>
      </div>
    </div>
  )
}
export default Home