import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState("/default-avatar.png"); // foto default
  const [name, setName] = useState("Nama Pengguna");
  const [email, setEmail] = useState("user@email.com");

  // Buka file explorer
  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // Saat file dipilih
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  // Tombol aksi
  const handleSave = () => {
    alert("Perubahan disimpan!");
  };

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar?")) {
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Apakah Anda yakin ingin menghapus akun?")) {
      alert("Akun berhasil dihapus.");
      navigate("/register");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Profil Pengguna</h1>

      {/* Bagian Foto Profil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-300"
          />
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-green-600 text-white text-sm px-3 py-1 rounded-full hover:bg-green-700 transition"
          >
            Edit Photo
          </button>

          {/* input file tersembunyi */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Form Info User */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Simpan Perubahan
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Keluar
        </button>
        <button
          onClick={handleDeleteAccount}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Hapus Akun
        </button>
      </div>
    </div>
  );
}
