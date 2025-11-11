import React, { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [formData, setFormData] = useState({
    namaKebun: "",
    email: "",
    noTelp: "",
    deskripsi: "",
    tinggiWilayah: "",
  });

  const [photo, setPhoto] = useState("https://via.placeholder.com/100"); // foto default
  const fileInputRef = useRef(null); // referensi input file

  const [showSaved, setShowSaved] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // ketika isi form diubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // tombol simpan
  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // tombol logout
  const handleLogout = () => {
    setShowLogout(false);
    console.log("User logged out");
  };

  // tombol hapus akun
  const handleDelete = () => {
    setShowDelete(false);
    console.log("Account deleted");
  };

  // buka file explorer
  const handleEditPhoto = () => {
    fileInputRef.current.click();
  };

  // saat foto dipilih
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-100 to-green-200 flex flex-col items-center p-8">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">AVOCYCLE</h1>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-gray-600 text-lg">👤</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-green-100 shadow-md p-8 rounded-2xl w-full max-w-4xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={photo}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-green-300"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Nama Kebun</h2>
            <p className="text-gray-500">nama@gmail.com</p>
          </div>

          {/* Tombol Edit Foto */}
          <button
            onClick={handleEditPhoto}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaEdit /> Edit Foto
          </button>

          {/* Input file tersembunyi */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Form Input */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Nama Kebun</label>
            <input
              name="namaKebun"
              value={formData.namaKebun}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Nama Kebun"
            />
            <label className="block text-sm mt-4 mb-1">E-mail</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="example@gmail.com"
            />
            <label className="block text-sm mt-4 mb-1">No. Telp</label>
            <input
              name="noTelp"
              value={formData.noTelp}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="08xxxxx"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Deskripsi Kebun</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Deskripsi Kebun"
            />
            <label className="block text-sm mt-4 mb-1">Tinggi Wilayah (mdpl)</label>
            <input
              name="tinggiWilayah"
              value={formData.tinggiWilayah}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Tinggi Wilayah (mdpl)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg"
          >
            Simpan
          </button>
          <button
            onClick={() => setShowLogout(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
          >
            Keluar
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg"
          >
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Modal Simpan */}
      {showSaved && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="text-green-600 text-4xl mb-3">✔</div>
            <p>Perubahan berhasil disimpan</p>
          </div>
        </div>
      )}

      {/* Modal Keluar */}
      {showLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl text-center">
            <h3 className="font-bold text-lg mb-2">Yakin mau keluar?</h3>
            <p className="text-sm mb-4">
              Anda harus melakukan login kembali saat masuk
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Keluar
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Akun */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-xl text-center">
            <h3 className="font-bold text-lg mb-2">Yakin mau dihapus?</h3>
            <p className="text-sm mb-4">
              Akun tidak akan bisa digunakan kembali setelah dihapus
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
