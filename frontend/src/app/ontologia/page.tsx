'use client'

import { Button, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from "react";
import { styled } from "@mui/system";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { showToast } from "@/store/ToastSlice";
import { useDispatch } from "react-redux";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Ontologia = () => {
  const dispatch = useDispatch()
  const [file, setFile] = useState(null);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    dispatch(showLoading())
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/load`, {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          dispatch(showToast({type: 'success', message: 'Ontologia atualizada com sucesso!'}))
        } else {
          dispatch(showToast({
            type: 'error',
            message: 'Erro ao atualizar a ontologia!'
          }))
        }
      }).finally(() => {
      dispatch(hideLoading())
    })
  };

  return (
    <div className={'pageContainer'}>
      <Typography className={'pageTitle'} variant={'h4'}>
        Adicione um arquivo no formato RDF para atualizar a ontologia utilizada pelo sistema
      </Typography>

      <Button component="label" size="large" variant="contained" startIcon={<CloudUploadIcon/>}>
        Adicione o arquivo
        <VisuallyHiddenInput
          type="file"
          accept=".rdf"
          onChange={handleFileChange}
        />
      </Button>
    </div>
  )
}

export default Ontologia