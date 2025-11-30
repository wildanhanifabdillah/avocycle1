import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ENDPOINTS } from "../../api/endpoints";
import Brand from "../../components/Brand";
import Field, { Label } from "../../components/Field";
import Button from "../../components/Button";
import Divider from "../../components/Divider";

import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });  


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);

    if (res.success) {
      navigate("/dashboard");
    } else {
      alert(res.error || "Login gagal");
  }
}

  return (
    <div>
      <Brand />

      <h1 className="text-4xl font-extrabold mb-8">Sign in</h1>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="mb-5">
          <Label>Email</Label>
          <Field
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-7">
          <Label>Password</Label>
          <Field
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign in"}
        </Button>

        <Divider label="OR" />

        {/* GOOGLE LOGIN */}
        <Button
          type="button"
          onClick={() => navigate("/login-google")}
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </Button>

        {/* Register + Forgot Password */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <a href="#" className="text-brand-700 hover:underline">
            Forgot Password?
          </a>
          <a href="/register-role" className="text-brand-700 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
