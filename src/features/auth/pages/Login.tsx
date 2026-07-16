import LoginForm from "../components/LoginForm";
import { Lock } from "@solar-icons/react";
export default function Login() {
  return (
    <div className="min-h-screen bg-[#1e187b] flex items-center justify-center">
      <div className="w-full max-w-[370px] px-8 mb-40">
        <div className="flex  items-center gap-2 justify-between mb-8">
          <img src="/logoentel.png" width={170}  alt="Logo" />
          <Lock weight="BoldDuotone" size={40} color="white" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
