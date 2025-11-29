import { useParams } from "react-router-dom";
import usePlantDetail from "../hooks/usePlantDetail";
import EditFaseBerbungaModal from "./Modals/EditFaseBerbungaModal";
import EditFaseBerbuahModal from "./Modals/EditFaseBerbuahModal";
import EditPlantModal from "./Modals/EditPlantModal";
import { toDMY } from "../utils/date";
import { FaEdit, FaSyringe } from "react-icons/fa";

export default function PlantDetail() {
  const { id } = useParams();

  const {
    phases,
    faseBerbungaData,
    faseBerbuahData,
    openFlowerModal,
    openFruitModal,
    openEditPlant,
    expandedPhase,
    progressPx,
    step1Done,
    step2Done,
    step3Done,
    lineAreaRef,
    stepRefs,

    setOpenFlowerModal,
    setOpenFruitModal,
    setOpenEditPlant,
    setExpandedPhase,

    addFaseBerbunga,
    addFaseBerbuah,
    generateEstimasi,
  } = usePlantDetail(id);

  // 🚨 Contoh data. Nanti diganti API-mu.
  const plant = {
    id,
    code: "Pohon AV001",
    date: "2 Oktober 2023",
    age: "24 bulan",
    health: "Sehat",
    image: "/avocado1.png",
    stages: [
      { id: 1, name: "Fase Berbunga" },
      { id: 2, name: "Fase Berbuah" },
      { id: 3, name: "Fase Panen" },
    ],
    growthHistory: [
      { badge: "Fase 1", title: "Fase Berbunga", desc: "Silakan isi saat pohon muncul bunga" },
      { badge: "Fase 2", title: "Fase Berbuah", desc: "Silakan isi saat pohon muncul buah" },
      { badge: "Fase 3", title: "Fase Siap Panen", desc: "Buah sudah siap dipanen" },
    ],
    diseaseHistory: [
      { date: "15/09/2025", component: "Pohon AV001", disease: "Antraknosa", status: "Belum dirawat" },
      { date: "16/09/2025", component: "Pohon AV001", disease: "Antraknosa", status: "Belum dirawat" },
    ],
  };

  return (
    <div className="space-y-6">

      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <img
            src={plant.image}
            alt={plant.code}
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{plant.code}</h2>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium 
                  ${
                    plant.health === "Sakit"
                      ? "border border-red-500 text-red-500"
                      : "border border-green-500 text-green-600"
                  }
                `}
              >
                {plant.health || "Sehat"}
              </span>
            </div>

            <p className="text-sm text-gray-700">Jenis: {plant.type}</p>
            <p className="text-sm text-gray-700">Usia: {plant.age}</p>
            <p className="text-sm text-gray-700">Tanggal Tanam: {toDMY(plant.date)}</p>
            <p className="text-sm text-gray-700">
              Estimasi Panen: {faseBerbuahData?.estimasi || "-"}
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

      {/* Siklus Pertumbuhan */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">Siklus Pertumbuhan</h3>
        <div className="relative">
          <div ref={lineAreaRef} className="absolute left-8 right-8 top-4 h-0.5">
            <div className="absolute inset-0 bg-gray-300" />
            <div
              className="absolute inset-0 bg-green-500"
              style={{ width: `${progressPx}px` }}
            />
          </div>

          <ol className="flex justify-between">
            {plant.stages.map((s, i) => {
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

      {/* Riwayat Fase */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">Riwayat Siklus Pertumbuhan</h3>

        <div className="space-y-3">
          {plant.growthHistory.map((h, idx) => {
            const isBerbunga = h.title.toLowerCase().includes("berbunga");
            const isBerbuah = h.title.toLowerCase().includes("berbuah");
            const isPanen = !isBerbunga && !isBerbuah;

            if (
              expandedPhase &&
              !(
                (expandedPhase === "berbunga" && isBerbunga) ||
                (expandedPhase === "berbuah" && isBerbuah) ||
                (expandedPhase === "panen" && isPanen)
              )
            ) {
              return null;
            }

            return (
              <div key={idx} className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div
                    className="cursor-pointer select-none"
                    onClick={() =>
                      setExpandedPhase(
                        isBerbunga
                          ? expandedPhase === "berbunga"
                            ? null
                            : "berbunga"
                          : isBerbuah
                          ? expandedPhase === "berbuah"
                            ? null
                            : "berbuah"
                          : expandedPhase === "panen"
                          ? null
                          : "panen"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border border-green-300">
                        {h.badge}
                      </span>
                      <span className="font-semibold text-gray-800">{h.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{h.desc}</p>
                  </div>

                  <button
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                    aria-label="Edit item"
                    onClick={() => {
                      if (isBerbunga) setOpenFlowerModal(true);
                      if (isBerbuah) setOpenFruitModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </div>

                {/* BERBUNGA */}
                {isBerbunga && expandedPhase === "berbunga" && (
                  <div className="mt-4 overflow-x-auto">
                    {phases.berbunga.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Belum ada data.</p>
                    ) : (
                      <>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-700">
                              <th className="py-2 px-3">Tanggal</th>
                              <th className="py-2 px-3">Muncul Bunga</th>
                              <th className="py-2 px-3">Pecah Bunga</th>
                              <th className="py-2 px-3">Pentil Pertama</th>
                            </tr>
                          </thead>
                          <tbody>
                            {phases.berbunga.map((row, i) => (
                              <tr key={i} className="border-t border-gray-300">
                                <td className="py-3 px-3">{row.date || "-"}</td>
                                <td className="py-3 px-3">{row.munculBunga || "-"}</td>
                                <td className="py-3 px-3">{row.pecahBunga || "-"}</td>
                                <td className="py-3 px-3">{row.pentilPertama || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                          <button className="px-2 py-1">&lt;</button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded">
                            1
                          </button>
                          <button className="px-2 py-1">2</button>
                          <span>3</span>
                          <span>…</span>
                          <button className="px-2 py-1">&gt;</button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* BERBUAH */}
                {isBerbuah && expandedPhase === "berbuah" && (
                  <div className="mt-4 overflow-x-auto">
                    {phases.berbuah.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Belum ada data.</p>
                    ) : (
                      <>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-700">
                              <th className="py-2 px-3">Tanggal</th>
                              <th className="py-2 px-3">Cover</th>
                              <th className="py-2 px-3">Warna Label</th>
                              <th className="py-2 px-3">Estimasi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {phases.berbuah.map((row, i) => (
                              <tr
                                key={i}
                                className={`${
                                  row.labelColor === "red"
                                    ? "bg-red-200"
                                    : row.labelColor === "yellow"
                                    ? "bg-yellow-100"
                                    : ""
                                } border-t border-gray-300`}
                              >
                                <td className="py-3 px-3">{row.date || "-"}</td>
                                <td className="py-3 px-3">{row.cover || "-"}</td>
                                <td className="py-3 px-3">
                                  <span className="inline-flex items-center gap-2">
                                    <span
                                      className="inline-block w-3 h-3 rounded-full"
                                      style={{ backgroundColor: row.labelColor || "red" }}
                                    />
                                    {row.labelColor === "red"
                                      ? "Merah"
                                      : row.labelColor === "yellow"
                                      ? "Kuning"
                                      : "Hijau"}
                                  </span>
                                </td>
                                <td className="py-3 px-3">{row.estimasi || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                          <button className="px-2 py-1">&lt;</button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded">
                            1
                          </button>
                          <button className="px-2 py-1">2</button>
                          <span>3</span>
                          <span>…</span>
                          <button className="px-2 py-1">&gt;</button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* PANEN */}
                {isPanen && expandedPhase === "panen" && (
                  <div className="mt-4 overflow-x-auto">
                    {phases.berbuah.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Belum ada data.</p>
                    ) : (
                      <>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-700">
                              <th className="py-2 px-3">Tanggal</th>
                              <th className="py-2 px-3">Cover</th>
                              <th className="py-2 px-3">Warna Label</th>
                              <th className="py-2 px-3">Sudah dipanen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {phases.berbuah.map((row, i) => (
                              <tr
                                key={i}
                                className={`${
                                  row.labelColor === "red"
                                    ? "bg-red-200"
                                    : row.labelColor === "yellow"
                                    ? "bg-yellow-100"
                                    : ""
                                } border-t border-gray-300`}
                              >
                                <td className="py-3 px-3">{row.date || "-"}</td>
                                <td className="py-3 px-3">{row.cover || "-"}</td>
                                <td className="py-3 px-3">
                                  <span className="inline-flex items-center gap-2">
                                    <span
                                      className="inline-block w-3 h-3 rounded-full"
                                      style={{ backgroundColor: row.labelColor || "red" }}
                                    />
                                    {row.labelColor === "red"
                                      ? "Merah"
                                      : row.labelColor === "yellow"
                                      ? "Kuning"
                                      : "Hijau"}
                                  </span>
                                </td>
                                <td className="py-3 px-3">-</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                          <button className="px-2 py-1">&lt;</button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded">
                            1
                          </button>
                          <button className="px-2 py-1">2</button>
                          <span>3</span>
                          <span>…</span>
                          <button className="px-2 py-1">&gt;</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat Penyakit */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">Riwayat Penyakit</h3>

        <div className="relative bg-green-50 border border-green-200 rounded-xl p-4 pr-16">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="py-2 px-3">Tanggal</th>
                <th className="py-2 px-3">Komponen</th>
                <th className="py-2 px-3">Penyakit</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {plant.diseaseHistory.map((row, i) => (
                <tr key={i} className="border-t border-green-200">
                  <td className="py-3 px-3 text-gray-800">{row.date}</td>
                  <td className="py-3 px-3 text-gray-800">{row.component}</td>
                  <td className="py-3 px-3 text-gray-800">{row.disease}</td>
                  <td className="py-3 px-3 text-gray-700">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow hover:bg-green-700">
            <FaSyringe />
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditFaseBerbungaModal
        open={openFlowerModal}
        onClose={() => setOpenFlowerModal(false)}
        initialData={faseBerbungaData}
        onSave={addFaseBerbunga}
      />

      <EditFaseBerbuahModal
        open={openFruitModal}
        onClose={() => setOpenFruitModal(false)}
        initialData={faseBerbuahData}
        onSave={(data) => {
          const estimasi = generateEstimasi(data);
          addFaseBerbuah({ ...data, estimasi });
        }}
      />

      {openEditPlant && (
        <EditPlantModal
          onClose={() => setOpenEditPlant(false)}
          initialData={{
            type: "",
            date: "",
            period: "",
            code: plant.code,
          }}
          onSave={(data) => {
            console.log("Edit tanaman disimpan:", data);
            setOpenEditPlant(false);

            try {
              const metaKey = `plant:${id}:meta`;
              const prev = JSON.parse(localStorage.getItem(metaKey) || "{}");

              const payload = {
                version: 1,
                updatedAt: new Date().toISOString(),
                ...prev,
                type: data?.type ?? prev.type ?? "",
                date: data?.date ?? prev.date ?? "",
                period: data?.period ?? prev.period ?? "",
                code: data?.code ?? prev.code ?? plant.code,
              };

              localStorage.setItem(metaKey, JSON.stringify(payload));
            } catch {
              // ignore error
            }
          }}
        />
      )}
    </div>
  );
}
