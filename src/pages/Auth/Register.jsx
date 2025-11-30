import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import Brand from "../../components/Brand";
import Field, { Label } from "../../components/Field";
import Button from "../../components/Button";

export default function Register() {
  const navigate = useNavigate();
  const { registerPetani, loading } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI FRONTEND
    if (!form.full_name || !form.email || !form.password || !form.phone) {
      return alert("Semua field wajib diisi.");
    }

    if (form.password !== form.confirm) {
      return alert("Password dan konfirmasi tidak cocok.");
    }

    if (form.password.length < 6) {
      return alert("Password kurang dari 6 karakter.");
    }

    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      auth_provider: "Local",
      role: "Petani",
    };

    const res = await registerPetani(payload);

    if (!res.success) {
      return alert(res.error || "Registrasi gagal.");
    }

    alert("Registrasi berhasil! Silakan login.");
    navigate("/login");
  };

  return (
    <div>
      <Brand />

      <h1 className="text-[40px] leading-none sm:text-5xl font-extrabold mb-8">
        Register Petani
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl">
        {/* NAMA */}
        <div className="mb-5">
          <Label htmlFor="full_name">Nama Lengkap</Label>
          <Field
            id="full_name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <Label htmlFor="email">E-mail</Label>
          <Field
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <Label htmlFor="password">Password</Label>
          <Field
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-5">
          <Label htmlFor="confirm">Konfirmasi Password</Label>
          <Field
            id="confirm"
            type="password"
            placeholder="Konfirmasi Password"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        {/* PHONE */}
        <div className="mb-7">
          <Label htmlFor="phone">No. Telp</Label>
          <Field
            id="phone"
            type="tel"
            placeholder="08xxxxx"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* BUTTON REGISTER */}
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>

        <p className="mt-6 text-sm items-center justify-center flex gap-1">
          Sudah punya akun?
          <Link to="/login" className="text-brand-700 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
