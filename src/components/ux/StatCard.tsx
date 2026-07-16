interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ComponentType<any>;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';
}

export default function StatCard({ title, value, subtitle, icon: Icon, variant = 'primary' }: StatCardProps) {
  const styles = {
    primary: {
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glow: 'shadow-blue-500/20',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accent: 'bg-blue-500',
      borderGlow: 'border-blue-200',
      textGradient: 'from-blue-600 to-indigo-600',
      progressBg: 'bg-blue-100',
      dotColor: 'bg-blue-500',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900'
    },
    secondary: {
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      glow: 'shadow-blue-400/20',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      accent: 'bg-blue-400',
      borderGlow: 'border-blue-100',
      textGradient: 'from-blue-500 to-blue-600',
      progressBg: 'bg-blue-50',
      dotColor: 'bg-blue-400',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900'
    },
    tertiary: {
      gradient: 'from-slate-400 via-blue-400 to-blue-500',
      glow: 'shadow-slate-400/20',
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-600',
      accent: 'bg-slate-400',
      borderGlow: 'border-slate-200',
      textGradient: 'from-slate-600 to-blue-600',
      progressBg: 'bg-slate-100',
      dotColor: 'bg-slate-400',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900'
    },
    success: {
      gradient: 'from-blue-400 via-cyan-500 to-teal-500',
      glow: 'shadow-cyan-400/20',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      accent: 'bg-cyan-500',
      borderGlow: 'border-cyan-200',
      textGradient: 'from-cyan-600 to-teal-600',
      progressBg: 'bg-cyan-100',
      dotColor: 'bg-cyan-500',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900'
    },
    danger: {
      gradient: 'from-red-400 via-rose-500 to-pink-500',
      glow: 'shadow-red-400/20',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      accent: 'bg-red-500',
      borderGlow: 'border-red-200',
      textGradient: 'from-red-600 to-pink-600',
      progressBg: 'bg-red-100',
      dotColor: 'bg-red-500',
      titleColor: 'text-slate-500',
      valueColor: 'text-slate-900'
    }
  };

  const currentStyle = styles[variant] || styles.primary;

  return (
    <div className="relative group cursor-pointer">
      <div className="absolute -inset-1 bg-linear-to-r from-slate-200 to-slate-100 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className={`absolute -inset-0.5 bg-linear-to-r ${currentStyle.gradient} rounded-2xl blur opacity-0 group-hover:opacity-15 transition duration-500`} />
      
      <div className="relative min-w-60 rounded-2xl bg-white p-6 flex flex-col justify-between border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
        
        <div className="absolute top-0 left-6 right-6 h-1 bg-linear-to-r from-transparent via-currentStyle.accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" className={currentStyle.iconColor} />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" className={currentStyle.iconColor} />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" className={currentStyle.iconColor} />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" className={currentStyle.iconColor} />
          </svg>
        </div>

        <div className="flex items-start justify-between w-full relative z-10">
          <div className="space-y-1.5">
            <span className={`text-xs font-semibold ${currentStyle.titleColor} uppercase tracking-widest`}>
              {title}
            </span>
            <div className={`h-0.5 w-8 bg-linear-to-r ${currentStyle.gradient} rounded-full group-hover:w-12 transition-all duration-300`} />
          </div>
          
          {Icon && (
            <div className={`p-2 rounded-xl ${currentStyle.iconBg} border border-slate-100 group-hover:shadow-md group-hover:rotate-6 transition-all duration-300`}>
              <Icon size={20} weight="BoldDuotone" className={`${currentStyle.iconColor} group-hover:scale-110 transition-transform duration-300`} />
            </div>
          )}
        </div>

        <div className="my-2 relative z-10">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${currentStyle.valueColor} group-hover:scale-105 transition-transform duration-300 origin-left`}>
              {value}
            </span>
          </div>
        </div>

        <div className="mt-2 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 font-light group-hover:text-slate-600 transition-colors duration-300">
              {subtitle}
            </span>
            
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
              <div className={`w-7 h-7 rounded-full ${currentStyle.iconBg} flex items-center justify-center hover:shadow-md transition-all duration-300`}>
                <svg className={`w-3.5 h-3.5 ${currentStyle.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${currentStyle.progressBg} rounded-full overflow-hidden`}>
          <div className={`h-full w-3/4 bg-linear-to-r ${currentStyle.gradient} rounded-full group-hover:w-full transition-all duration-1000`} />
        </div>

        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-1.5 h-1.5 rounded-full ${currentStyle.dotColor}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${currentStyle.dotColor} opacity-70`} />
          <div className={`w-1.5 h-1.5 rounded-full ${currentStyle.dotColor} opacity-40`} />
        </div>
      </div>
    </div>
  );
}