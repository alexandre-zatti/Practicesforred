import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { hideToast } from '@/store/ToastSlice';
import { RootState } from "@/store/store";

const Toast = () => {
  const dispatch = useDispatch();
  const {isOpen, message, type} = useSelector((state: RootState) => state.toast)

  const handleClose = () => {
    dispatch(hideToast());
  };

  return (
    <Snackbar open={isOpen} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={6000}
              onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
