import { Link } from "react-router-dom";
import Brand from "../../components/Brand.jsx";
import Field, { Label } from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";

export default function Register() {
  return (
    <div>
      <Brand />

      <h1 className="text-[40px] leading-none sm:text-5xl font-extrabold mb-8 ">Register</h1>

      <form className="max-w-xl">
        <div className="mb-5">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Field id="name" type="text" placeholder="Nama Lengkap" autoComplete="name" />
        </div>

        <div className="mb-5">
          <Label htmlFor="email">E-mail</Label>
          <Field id="email" type="email" placeholder="example@gmail.com" autoComplete="email" />
        </div>

        <div className="mb-5">
          <Label htmlFor="password">Password</Label>
          <Field id="password" type="password" placeholder="Password" autoComplete="new-password" />
        </div>

        <div className="mb-5">
          <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
          <Field
            id="password_confirmation"
            type="password"
            placeholder="Konfirmasi Password"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-7">
          <Label htmlFor="phone">No. Telp</Label>
          <Field id="phone" type="tel" placeholder="08xxxxx" autoComplete="tel" />
        </div>

         {/* tombol sign in */}
                 <Button type="submit">Register</Button>

        <p className="mt-6 text-sm items-center justify-center flex gap-1">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-brand-700 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
