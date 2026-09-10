import { useState, useCallback } from 'react';
import { useCreateSensorInstallationMutation } from '../services/sensorsApi';
import { addToast } from '@heroui/react';

interface UseSensorInstallationModalReturn {
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;
    createInstallation: (data: {
        waterMeterId: number;
        sensorId: number;
        observation: string;
        previousRemovalReason: string;
        technicianId: number;
    }) => Promise<{ success: boolean; data?: any }>;
    reset: () => void;
}

export function useSensorInstallation(): UseSensorInstallationModalReturn {
    const [createSensorInstallation] = useCreateSensorInstallationMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createInstallation = useCallback(async (data: {
        waterMeterId: number;
        sensorId: number;
        observation: string;
        previousRemovalReason: string;
    }) => {
        setIsSubmitting(true);
        setError(null);
        setIsSuccess(false);

        try {
            const requestData = {
                sensorId: data.sensorId,
                waterMeterId: data.waterMeterId,
                technicianId: 1,
                notes: data.observation || '',
                previousRemovalReason: data.previousRemovalReason || 'NONE',
            };

            const result = await createSensorInstallation(requestData).unwrap();

            setIsSuccess(true);
            addToast({
                title: 'Éxito',
                description: 'Instalación creada exitosamente',
                color: 'success',
            });

            return { success: true, data: result };
        } catch (error: any) {
            const message = error?.data?.message || error?.data?.errors || 'Error al crear la instalación';
            setError(typeof message === 'string' ? message : JSON.stringify(message));

            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });

            return { success: false };
        } finally {
            setIsSubmitting(false);
        }
    }, [createSensorInstallation]);

    const reset = useCallback(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        setError(null);
    }, []);

    return {
        isSubmitting,
        isSuccess,
        error,
        createInstallation,
        reset,
    };
}