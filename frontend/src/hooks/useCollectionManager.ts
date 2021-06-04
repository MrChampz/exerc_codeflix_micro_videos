import { useSnackbar } from "notistack";

const useCollectionManager = (
  collection: any[],
  setCollection: (collection: any) => void
) => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    addItem: (item: any) => {
      if (!item?.id) return;
      const exists = collection.find(({ id }) => id === item.id);
      if (exists) {
        enqueueSnackbar('Item já adicionado', { variant: 'info' });
        return;
      }
      collection.unshift(item);
      setCollection(collection);
    },
    removeItem: (item: any) => {
      const index = collection.findIndex(({ id }) => id === item.id);
      if (index === -1) return;
      collection.splice(index, 1);
      setCollection(collection);
    },
  }
}

export default useCollectionManager;