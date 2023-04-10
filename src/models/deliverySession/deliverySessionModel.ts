import { InitCategoryPageState } from "../commons/initStateModel";
import { TrackableModel } from "../commons/trackableModel";
import { DataAttributeModel } from "../attribute/dataAttributeModel";
import { EmployeeModel } from "../employee/employeeModel";
import { StationModel } from "../station/stationModel";
import { VehicleModel } from "../vehicle/vehicleModel";

export interface InitDeliverySessionPageState extends InitCategoryPageState<DeliverySessionModel> { }

export interface DeliverySessionLineModel extends TrackableModel {
    code?: string,
    deliverySessionCode?: string,
    deliveryOrderGroupCode?: string,
    deliveryOrderParentCode?: string,
    deliveryOrderChildrenCode?: string,
    deliveryOrderCode?: string,
    referenceCode?: string,
    saleOrderCode?: string,
    deliveryPackageGroupCode?: string,
    deliveryPackageCode?: string,
    consumedAt?: number,
    consumedBy?: string,

    // For UI presenation
    hidden?: boolean,
    lineStatus?: string,
    message?: string,
}

export interface DeliverySessionModel extends TrackableModel {
    stt:number,
    code: string,
    sessionType?: string,
    parentCode?: string,
    parent?: DeliverySessionModel,
    driverCode?: string,
    driver?: EmployeeModel,
    coordinatorCode?: string,
    coordinator?: EmployeeModel,
    vehicleCode?: string,
    vehicle?: VehicleModel,
    startStationCode?: string,
    startStation?: StationModel,
    endStationCode?: string,
    endStation?: StationModel,
    sessionGroupCode?: string,
    toCustomer?: boolean,
    deliverySessionLines?: DeliverySessionLineModel[],
    allDeliverySessionLines?: DeliverySessionLineModel[],
    childrens?: DeliverySessionModel[],
    additional?: DataAttributeModel[],
    status: string,
    note?: string,
    excepted?: string,
    reasonCancel?: string,
    reasonReject?: string,
    totalReceivedItems?: number,
    consumedAt?: number,
    consumedBy?: string,
    totalDOs?: number,
    totalSOs?: number,
    totalDPs?: number,
    aVerifyBy?: string,
    aVerifyAt?: number,
    bVerifyBy?: string,
    bVerifyAt?: number,
    aVerifySourceBy?: string,
    aVerifySourceAt?: number,
    bVerifySourceBy?: string,
    bVerifySourceAt?: number,
    aVerifyDestBy?: string,
    aVerifyDestAt?: number,
    bVerifyDestBy?: string,
    bVerifyDestAt?: number,
}
