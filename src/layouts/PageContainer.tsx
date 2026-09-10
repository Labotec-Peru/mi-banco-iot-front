
export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 lg:pt-4 flex flex-col gap-6 bg-slate-50/50 dark:bg-background min-h-full">
      {children}
    </div>
  );
}