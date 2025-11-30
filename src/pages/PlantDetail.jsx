import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import usePlantDetail from "../hooks/usePlantDetail";

// MODAL
import EditFaseBerbungaModal from "./Modals/EditFaseBerbungaModal";
import EditFaseBerbuahModal from "./Modals/EditFaseBerbuahModal";
import EditFasePanenModal from "./Modals/EditFasePanenModal";
import EditPlantModal from "./Modals/EditPlantModal";

export default function PlantDetail() {
  const { id } = useParams();

  // ====== HOOK BARU ======
  const {
    plant,
    safePlant,
    phases,

    // loadingPlant,
    loadingFaseBunga,
    loadingFaseBuah,
    loadingFasePanen,

    // errorPlant,
    errorFaseBunga,
    errorFaseBuah,
    errorFasePanen,

    openFlowerModal,
    setOpenFlowerModal,
    openFruitModal,
    setOpenFruitModal,
    openPanenModal,
    setOpenPanenModal,
    openEditPlant,
    setOpenEditPlant,

    editingFlower,
    setEditingFlower,
    editingFruit,
    setEditingFruit,
    editingPanen,
    setEditingPanen,

    expandedPhase,
    setExpandedPhase,

    lineAreaRef,
    stepRefs,
    progressPx,

    handleSaveFlower,
    handleSaveFruit,
    handleSavePanen,
    handleSavePlant,
  } = usePlantDetail(id);

  // ================== UI TETAP PERSIS ==================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={safePlant.image}
            alt={safePlant.code}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{safePlant.code}</h2>
            <p className="text-sm text-gray-600">
              Tanggal Tanam: {safePlant.dateLabel}
            </p>
            <p className="text-sm text-gray-600">
              Usia: {safePlant.ageMonths} bulan
            </p>
            <p className="text-sm text-gray-600">
              Status Kesehatan:{" "}
              <span className="text-green-700 font-medium">
                {safePlant.health}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenEditPlant(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
        >
          <FaEdit /> Edit Data
        </button>
      </div>

      {/* SIKLUS PERTUMBUHAN */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">Siklus Pertumbuhan</h3>
        <div className="relative">
          <div ref={lineAreaRef} className="absolute left-8 right-8 top-4">
            <div className="h-0.5 bg-gray-300 w-full" />
            <div
              className="h-0.5 bg-green-500 absolute left-0 top-0"
              style={{ width: `${progressPx}px` }}
            />
          </div>

          <ol className="flex justify-between">
            {safePlant.stages.map((s, i) => {
              // circle coloring logic dipindah ke hook → tetap sama
              const step1Done = phases.berbunga.length > 0;
              const step2Done = phases.berbuah.length > 0;

              const step3Done = phases.panen.length > 0;

              const circleClass = (() => {
                if (i === 0) return step1Done ? "bg-green-600" : "bg-gray-400";
                if (i === 1)
                  return step2Done
                    ? "bg-green-600"
                    : step1Done
                    ? "bg-black"
                    : "bg-gray-400";
                if (i === 2)
                  return step3Done
                    ? "bg-green-600"
                    : step2Done
                    ? "bg-black"
                    : "bg-gray-400";
                return "bg-gray-400";
              })();

              return (
                <li key={s.id} className="flex flex-col items-center">
                  <div
                    ref={(el) => (stepRefs.current[i] = el)}
                    className={`relative z-10 w-10 h-10 rounded-full ${circleClass} text-white flex items-center justify-center font-semibold shadow`}
                  >
                    {s.id}
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{s.name}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ====== RIWAYAT FASE (UI SAMA EXACT) ====== */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">
          Riwayat Siklus Pertumbuhan
        </h3>

        <div className="space-y-3">
          {/* FASE 1 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(expandedPhase === "berbunga" ? null : "berbunga")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 1
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Berbunga
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Silakan isi saat pohon muncul bunga
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingFlower(null);
                  setOpenFlowerModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "berbunga" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFaseBunga ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFaseBunga ? (
                  <p className="text-sm text-red-600">{errorFaseBunga}</p>
                ) : phases.berbunga.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="py-2 px-3">Tanggal</th>
                        <th className="py-2 px-3">Muncul Bunga</th>
                        <th className="py-2 px-3">Pecah Bunga</th>
                        <th className="py-2 px-3">Pentil Pertama</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.berbunga.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-3 px-3 text-center">{r.date}</td>
                          <td className="py-3 px-3 text-center">
                            {r.munculBunga}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {r.pecahBunga}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {r.pentilPertama}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingFlower(r);
                                setOpenFlowerModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* FASE 2 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(expandedPhase === "berbuah" ? null : "berbuah")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 2
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Berbuah
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Silakan isi saat pohon muncul buah
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingFruit(null);
                  setOpenFruitModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "berbuah" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFaseBuah ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFaseBuah ? (
                  <p className="text-sm text-red-600">{errorFaseBuah}</p>
                ) : phases.berbuah.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="py-2 px-3">Tanggal Cover</th>
                        <th className="py-2 px-3">Jumlah Cover</th>
                        <th className="py-2 px-3">Warna Label</th>
                        <th className="py-2 px-3">Estimasi Panen</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.berbuah.map((row, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-3 px-3 text-center">{row.date}</td>
                          <td className="py-3 px-3 text-center">{row.cover}</td>
                          <td className="py-3 px-3 text-center">{row.labelColor}</td>
                          <td className="py-3 px-3 text-center">{row.estimasi}</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingFruit(row);
                                setOpenFruitModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* FASE 3 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(expandedPhase === "panen" ? null : "panen")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 3
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Panen
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Catat hasil panen aktual (jumlah, sampel, berat, foto)
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingPanen(null);
                  setOpenPanenModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "panen" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFasePanen ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFasePanen ? (
                  <p className="text-sm text-red-600">{errorFasePanen}</p>
                ) : phases.panen.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-700">
                        <th className="py-2 px-3 text-center">Tanggal Panen</th>
                        <th className="py-2 px-3 text-center">Jumlah Panen</th>
                        <th className="py-2 px-3 text-center">Catatan</th>
                        <th className="py-2 px-3 text-center">Foto</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.panen.map((row, i) => (
                        <tr key={i} className="border-t border-gray-300">
                          <td className="py-3 text-center">{row.date || "-"}</td>
                          <td className="py-3 text-center">
                            {row.jumlahPanen ?? "-"}
                          </td>
                          <td className="py-3 text-center">
                            {row.catatan || "-"}
                          </td>
                          <td className="py-3 text-center">
                            {row.fotoPanen ? (
                              <a
                                href={row.fotoPanen}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-green-700 text-xs"
                              >
                                Lihat
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Tidak ada
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingPanen(row);
                                setOpenPanenModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIWAYAT PENYAKIT */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold mb-4 text-gray-700">Riwayat Penyakit</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Komponen</th>
              <th>Penyakit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {safePlant.diseaseHistory.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">{row.date}</td>
                <td>{row.component}</td>
                <td>{row.disease}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== MODALS ====== */}
      <EditFaseBerbungaModal
        open={openFlowerModal}
        onClose={() => {
          setOpenFlowerModal(false);
          setEditingFlower(null);
        }}
        plantId={safePlant.id}
        initialData={editingFlower}
        onSave={handleSaveFlower}
      />

      <EditFaseBerbuahModal
        open={openFruitModal}
        onClose={() => {
          setOpenFruitModal(false);
          setEditingFruit(null);
        }}
        plantId={safePlant.id}
        initialData={editingFruit}
        onSave={handleSaveFruit}
      />

      <EditFasePanenModal
        open={openPanenModal}
        onClose={() => {
          setOpenPanenModal(false);
          setEditingPanen(null);
        }}
        plantId={safePlant.id}
        initialData={editingPanen}
        onSave={handleSavePanen}
      />

      <EditPlantModal
        open={openEditPlant}
        onClose={() => setOpenEditPlant(false)}
        initialData={{
          id: plant?.id || safePlant.id,
          name: plant?.name || "",
          type: plant?.varietas || "",
          date: plant?.plantedIso?.slice(0, 10) || "",
          period: plant?.periodDays || "",
          code: plant?.code || "",
          block: plant?.block || "",
          kebunId: plant?.kebunId,
        }}
        kebunId={plant?.kebunId}
        onSave={handleSavePlant}
      />
    </div>
  );
}

