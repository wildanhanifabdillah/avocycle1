import { useEffect, useState } from "react";
import KebunService from "../services/KebunService";

export default function useKebun() {
  const [kebun, setKebun] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 3;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedKebun, setSelectedKebun] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchKebun = async () => {
    setLoading(true);
    try {
      const res = await KebunService.getAll();
      const data = res.data ?? res;

      const pages = Math.ceil(data.length / limit);
      setTotalPages(pages);

      const start = (page - 1) * limit;
      const end = start + limit;

      setKebun(data.slice(start, end));
    } catch (err) {
      console.error("Error fetch kebun:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return {
    kebun,
    loading,
    page,
    totalPages,
    selectedKebun,
    openAdd,
    openEdit,
    setPage,
    fetchKebun,
    setSelectedKebun,
    setOpenAdd,
    setOpenEdit,
  };
}
