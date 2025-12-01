import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Brand from "../../components/Brand";
import Field, { Label } from "../../components/Field";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";

export default function RegisterPembeli() {
  const navigate = useNavigate();
  const { registerPembeli, loading } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = name || id;
    if (!key) return;
    setForm({ ...form, [key]: value });
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
      role: "Pembeli",
    };

    const res = await registerPembeli(payload);

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
        Register Pembeli
      </h1>

      <form className="max-w-xl" onSubmit={handleSubmit}>
        <div className="mb-5">
          <Label>Nama Lengkap</Label>
          <Field
            type="text"
            placeholder="Nama Lengkap"
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <Label>Email</Label>
          <Field
            type="email"
            placeholder="example@gmail.com"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <Label>Password</Label>
          <Field
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <Label>Konfirmasi Password</Label>
          <Field
            type="password"
            placeholder="Konfirmasi Password"
            id="confirm"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <Label>No. Telp</Label>
          <Field
            type="tel"
            placeholder="08xxxxx"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>

        <p className="mt-6 text-sm flex items-center justify-center gap-1">
          Sudah punya akun?
          <Link to="/login" className="text-brand-700 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
