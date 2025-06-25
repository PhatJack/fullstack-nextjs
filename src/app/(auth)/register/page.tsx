import { Metadata } from "next";
import RegisterForm from "../_components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
