import { useMemo } from "react";
import { useGetAllReadingsQuery } from "../services/readingsApi";
import { mapApiToLecturas } from "../services/lecturaMapper";
import type { Lectura } from "../types/lectura";

interface UseChartReadingsParams {
    waterMeterId?: number;
    startDate?: string;
    endDate?: string;
    enabled?: boolean;
}
export function useChartReadings({
    waterMeterId,
    startDate,
    endDate,
    enabled = true,
}: UseChartReadingsParams) {
    const shouldFetch = enabled && !!waterMeterId;

    const { data, isLoading, isFetching, error, refetch } = useGetAllReadingsQuery(
        { waterMeterId, startDate, endDate },
        { skip: !shouldFetch }
    );

    
    const readings: Lectura[] = useMemo(() => {
        if (!data) return [];
        const raw = Array.isArray(data) ? data : data?.content ?? [];
        return mapApiToLecturas(raw);
    }, [data]);

    return { readings, isLoading, isFetching, error, refetch };
}