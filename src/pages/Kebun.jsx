import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useKebun from "../hooks/useKebun";
import AddKebunModal from "./Modals/AddKebunModal";
import EditKebunModal from "./Modals/EditKebunModal";
import KebunService from "../services/KebunService";

export default function Kebun() {
  const {
    kebun,
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
  } = useKebun();
  const navigate = useNavigate();

  return (
    <div className="relative max-w-3xl mx-auto space-y-4 p-4">

      {kebun.map((item) => {
        const kebunId =
          item?.id ??
          item?.ID ??
          item?.id_kebun ??
          item?.KebunID ??
          item?.kebunId ??
          null;

        return (
          <div
            key={kebunId || item.id || item.nama_kebun}
            onClick={() => {
              if (!kebunId) return;
              navigate(`/kebun/${kebunId}/plants`);
            }}
            className="bg-white border-t-4 border-green-500 rounded-xl shadow p-4 flex justify-between"
          >
            <div>
              <h2 className="text-xl font-bold">{item.nama_kebun}</h2>
              <p className="text-sm text-gray-600">MDPL: {item.mdpl} mdpl</p>
            </div>

            <div className="flex items-start gap-4 text-gray-600">
              <FaEdit
                className="cursor-pointer hover:text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedKebun(item);
                  setOpenEdit(true);
                }}
              />

              <FaTrash
                className="cursor-pointer hover:text-red-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!kebunId) return;
                  await KebunService.delete(kebunId);
                  fetchKebun();
                }}
              />
            </div>
          </div>
        );
      })}

    {/* Pagination Clean */}
    <div className="flex justify-center items-center gap-3 pt-4">

    {/* Prev */}
    <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`
        text-gray-500 hover:text-green-600 transition
        ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}
        `}
    >
        &lt;
    </button>

    {/* Nomor Halaman */}
    <div className="flex items-center gap-2">
        {Array.from({ length: totalPages })
        .map((_, i) => i + 1)
        .slice(
            Math.max(0, page - 2),
            Math.min(totalPages, page + 1) + 1
        )
        .map((num) => (
            <button
            key={num}
            onClick={() => setPage(num)}
            className={`
                h-8 w-8 flex items-center justify-center rounded-full transition
                ${page === num
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:text-green-600"
                }
            `}
            >
            {num}
            </button>
        ))}

        {/* Ellipsis */}
        {page < totalPages - 2 && (
        <span className="text-gray-400">…</span>
        )}
    </div>

    {/* Next */}
    <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`
        text-gray-500 hover:text-green-600 transition
        ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}
        `}
    >
        &gt;
    </button>
    </div>



      {/* Floating Add Button */}
      <button
        onClick={() => setOpenAdd(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow hover:bg-green-700"
      >
        <FaPlus size={22} />
      </button>

      {/* Modals */}
      {openAdd && (
        <AddKebunModal onClose={() => setOpenAdd(false)} refresh={fetchKebun} />
      )}
      {openEdit && (
        <EditKebunModal
          initialData={selectedKebun}
          onClose={() => setOpenEdit(false)}
          refresh={fetchKebun}
        />
      )}
    </div>
  );
}
