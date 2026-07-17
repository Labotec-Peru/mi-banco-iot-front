import NeverasMapa from "../components/NeverasMapa";
import { NeveraFilterProvider } from '../contexts/NeveraFilterContext';
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full bg-[#f8faff]">
      <div className="w-full flex-1 relative">
        <NeveraFilterProvider>
          <NeverasMapa />
        </NeveraFilterProvider>
      </div>
    </div>
  );
}
