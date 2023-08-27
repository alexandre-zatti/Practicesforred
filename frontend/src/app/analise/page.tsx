'use client'

import { useEffect } from "react";

const Analise = () => {

  useEffect(() => {
    fetch('http://localhost:8080/api/ontology/fase-engenharia/consequencia').then((response) => {
      console.log(response)
    })
  }, [])

  return (
    <h1>teste</h1>
  )
}

export default Analise