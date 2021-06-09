import { useEffect, useState } from "react";

interface RowToDelete {
  index: any;
  dataIndex: any;
}

interface RowsToDelete {
  data: Array<RowToDelete>
}

const useDeleteCollection = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<RowsToDelete>({ data: [] });

  useEffect(() => {
    if (rowsToDelete.data.length) {
      setOpenDeleteDialog(true);
    }
  }, [rowsToDelete]);

  return {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete
  };
}

export default useDeleteCollection;