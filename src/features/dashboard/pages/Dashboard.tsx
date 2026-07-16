import NeverasMapa from "../components/NeverasMapa";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full bg-[#f8faff]">
      <div className="w-full flex-1 relative">
        <NeverasMapa />
      </div>
    </div>
  );
}
