
import type { WaterMeter } from "../types/waterMeter.types";
import type { Medidor } from "../types/medidor";

export const mapApiToMedidor = (apiMeter: WaterMeter): Medidor => {
    return {
        id: apiMeter.id,
        numeroSerie: apiMeter.serialNumber,
        codigoPod: apiMeter.podCode,
        imei: apiMeter.imei,
        marca: apiMeter.meterBrandId.toString(), 
        modelo: apiMeter.meterModelId.toString(),
        tipoMedidor: apiMeter.meterTypeId.toString(),
        tecnologiaRed: apiMeter.networkTechnologyId.toString(),
        empresaCliente: apiMeter.clientCompanyId.toString(), 
        empresaProveedora: apiMeter.providerCompanyId.toString(),
        direccion: apiMeter.installationAddress,
        latitud: apiMeter.latitude,
        longitud: apiMeter.longitude,
        valorInicial: apiMeter.initialValue,
        fechaInstalacion: apiMeter.installationDate,
        estado: apiMeter.status,
        consumo: apiMeter.consumption,
        isIntegrated: apiMeter.isIntegrated,
        ubigeoCode: apiMeter.ubigeoCode,
        uuid: apiMeter.uuid,
        created: apiMeter.created,
        updated: apiMeter.updated,
    };
};

export const mapMedidorToApi = (medidor: Partial<Medidor>): Partial<WaterMeter> => {
    return {
        serialNumber: medidor.numeroSerie,
        podCode: medidor.codigoPod,
        imei: medidor.imei,
    };
};