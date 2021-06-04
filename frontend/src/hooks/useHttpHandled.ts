import axios from "axios";
import { useSnackbar } from "notistack";

const useHttpHandled = () => {
  const { enqueueSnackbar } = useSnackbar();
  return async (request: Promise<any>) => {
    try {
      const { data } = await request;
      return data;
    } catch (error) {
      console.error(error);
      if (!axios.isCancel(error)) {
        enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' });
      };
      throw error;
    }
  }
}

export default useHttpHandled;