import styles from './footer.module.css'
import Image from "next/image";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div>
        <Image src={'/logo_ufsc.png'} alt={'logo ufsc'} width={70} height={100}/>
      </div>
      <div>
        <Typography variant={'h6'} className={styles.authors}>
          Alexandre Zatti, Viviane Duarte Bonfim & Fabiane Vavassori Benitti. 2023
        </Typography>
      </div>
      <div>
        <Image src={'/logo_unochapeco.png'} alt={'logo ufsc'} width={125} height={125}/>
      </div>
    </div>
  )
}

export default Footer