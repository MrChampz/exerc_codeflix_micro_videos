import React, { MutableRefObject, useRef } from 'react';
import { Button, FormControl, FormControlProps, FormHelperText } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InputFile, { InputFileComponent } from './InputFile';

interface UploadFieldProps {
  label: string;
  accept: string;
  setValue: (value: File) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

const UploadField: React.FC<UploadFieldProps> = (props) => {
  const { label, accept, setValue, error, disabled, FormControlProps } = props;
  
  const fileRef = useRef() as MutableRefObject<InputFileComponent>;

  return (
    <FormControl
      error={ error !== undefined }
      disabled={ disabled }
      fullWidth
      margin="normal"
      { ...FormControlProps }
    >
      <InputFile
        ref={ fileRef }
        TextFieldProps={{
          label: label,
          style: { backgroundColor: "#FFFFFF" }
        }}
        InputFileProps={{
          accept: accept,
          onChange: (event) => {
            const files = event.target.files;
            files!.length && setValue(files![0]);
          }
        }}
        button={
          <Button
            color="primary"
            variant="contained"
            endIcon={ <CloudUploadIcon /> }
            onClick={() => fileRef.current.openWindow()}
          >
            Adicionar
          </Button>
        }
      />
      <FormHelperText>{ error && error.message }</FormHelperText>
    </FormControl>
  );
};

export default UploadField;