import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

interface DeleteDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={ open }
      onClose={() => onClose(false)}
    >
      <DialogTitle>
        Exclusão de registros
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja realmente excluir este(s) registro(s)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => onClose(false)}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          onClick={() => onClose(true)}
          autoFocus
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;