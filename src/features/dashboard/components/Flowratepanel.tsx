type FlowRatePanelProps = {
    flow: number;
    normalRange: [number, number];
    history: number[];
};

function Sparkline({ data, isAlert }: { data: number[]; isAlert: boolean }) {
    if (data.length < 2) return null;

    const w = 240;
    const h = 56;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((value - min) / range) * h;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            className="mt-3 h-14 w-full"
            preserveAspectRatio="none"
        >
            <polyline
                points={points}
                fill="none"
                strokeWidth={2}
                className={isAlert ? "stroke-danger" : "stroke-primary"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function FlowRatePanel({
    flow,
    normalRange,
    history,
}: FlowRatePanelProps) {
    const [min, max] = normalRange;
    const inRange = flow >= min && flow <= max;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                    {flow}
                </span>
                <span className="text-sm text-default-400">L/min</span>
            </div>

            <p
                className={`mt-1 text-xs font-medium ${
                    inRange ? "text-default-400" : "text-danger"
                }`}
            >
                {inRange
                    ? `Dentro del rango normal (${min}–${max} L/min)`
                    : `Fuera del rango normal (${min}–${max} L/min)`}
            </p>

            <div className="mt-auto">
                <Sparkline data={history} isAlert={!inRange} />
                <p className="mt-1 text-[10px] text-default-400">
                    Últimas {history.length} lecturas
                </p>
            </div>
        </div>
    );
}