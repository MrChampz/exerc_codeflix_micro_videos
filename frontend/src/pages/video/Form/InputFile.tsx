import React, { forwardRef, MutableRefObject, ReactNode, RefAttributes, useImperativeHandle, useRef, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';

type NativeInputFileProps =
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface InputFileProps extends RefAttributes<InputFileComponent> {
  button: ReactNode;
  InputFileProps?: NativeInputFileProps;
  TextFieldProps?: TextFieldProps;
}

export interface InputFileComponent {
  openWindow: () => void;
  clear: () => void;
}

const InputFile = forwardRef<InputFileComponent, InputFileProps>((props, ref) => {
  const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [fileName, setFileName] = useState("");

  const textFieldProps: TextFieldProps = {
    variant: 'outlined',
    ...props.TextFieldProps,
    InputLabelProps: {
      shrink: true
    },
    InputProps: {
      ...(props.TextFieldProps && props.TextFieldProps.InputProps && {
        ...props.TextFieldProps.InputProps
      }),
      readOnly: true,
      endAdornment: (
        <InputAdornment position="end">
          { props.button }
        </InputAdornment>
      ),
    },
    value: fileName
  };

  const inputFileProps: NativeInputFileProps = {
    ...props.InputFileProps,
    hidden: true,
    ref: fileRef,
    onChange: (event) => {
      const files = event.target.files;
      if (files && files.length) {
        setFileName(Array.from(files).map(file => file.name).join(', '));
      }
      if (props.InputFileProps && props.InputFileProps.onChange) {
        props.InputFileProps.onChange(event);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    openWindow: () => fileRef.current.click(),
    clear: () => setFileName("")
  }));

  return (
    <>
     <input type="file" { ...inputFileProps } />
     <TextField { ...textFieldProps } />
    </>
  );
});

export default InputFile;