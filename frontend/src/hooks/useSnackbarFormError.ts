import { useSnackbar } from "notistack";
import { useEffect } from "react";

const useSnackbarFormError = (submitCount: number, errors: any) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const hasError = Object.keys(errors).length !== 0;
    if (submitCount > 0 && hasError) {
      enqueueSnackbar("Formulário inválido. Reveja os campos marcados em vermelho.", {
        variant: 'error'
      });
    }
  }, [submitCount]);
}

export default useSnackbarFormError;