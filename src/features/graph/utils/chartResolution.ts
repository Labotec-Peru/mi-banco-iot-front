export type BucketUnit = "minute" | "hour" | "day" | "week";

export interface Resolution {
    unit: BucketUnit;
    amount: number;
    label: string;
}

export function getResolution(startDate?: string, endDate?: string): Resolution {
    if (!startDate || !endDate) {
        return { unit: "hour", amount: 1, label: "dd/MM HH:mm" };
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours <= 2) return { unit: "minute", amount: 1, label: "HH:mm" };
    if (diffHours <= 12) return { unit: "minute", amount: 5, label: "HH:mm" };
    if (diffHours <= 24) return { unit: "minute", amount: 15, label: "HH:mm" };
    if (diffDays <= 3) return { unit: "hour", amount: 1, label: "dd/MM HH:mm" };
    if (diffDays <= 7) return { unit: "hour", amount: 3, label: "dd/MM HH:mm" };
    if (diffDays <= 30) return { unit: "day", amount: 1, label: "dd/MM" };
    return { unit: "week", amount: 1, label: "dd/MM" };
}

export function floorToBucket(date: Date, unit: BucketUnit, amount: number): Date {
    const d = new Date(date);

    if (unit === "minute") {
        const m = d.getMinutes();
        d.setMinutes(Math.floor(m / amount) * amount, 0, 0);
    } else if (unit === "hour") {
        const h = d.getHours();
        d.setHours(Math.floor(h / amount) * amount, 0, 0, 0);
    } else if (unit === "day") {
        d.setHours(0, 0, 0, 0);
    } else if (unit === "week") {
        d.setHours(0, 0, 0, 0);
        const day = d.getDay(); 
        d.setDate(d.getDate() - ((day + 6) % 7)); 
    }
    return d;
}

export function formatBucketLabel(date: Date, resolution: Resolution): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    if (resolution.label === "HH:mm") return `${HH}:${mm}`;
    if (resolution.label === "dd/MM HH:mm") return `${dd}/${MM} ${HH}:${mm}`;
    return `${dd}/${MM}`;
}