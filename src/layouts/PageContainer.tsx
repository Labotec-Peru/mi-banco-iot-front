
export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-24 pb-10 px-10 flex flex-col gap-6 bg-slate-50/50 min-h-full">
      {children}
    </div>
  );
}