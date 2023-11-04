import React from 'react';
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { RootState } from "@/store/store";

const Loading = () => {
  const isLoading = useSelector((state: RootState) => state.loading.loading)

  return (
    <Backdrop
      sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999999}}
      open={isLoading}
    >
      <CircularProgress color="inherit"/>
    </Backdrop>
  );
};

export default Loading;
