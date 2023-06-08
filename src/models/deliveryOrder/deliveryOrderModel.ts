import { InitCategoryPageState } from "../commons/initStateModel";
import { TrackableModel } from "../commons/trackableModel";
import { DataAttributeModel } from "../attribute/dataAttributeModel";
import { StationModel } from "../station/stationModel";
import { EmployeeModel } from "models/employee/employeeModel";
import { AddressModel } from "models/address/addressModel";

export interface InitDeliveryOrderPageState extends InitCategoryPageState<DeliveryOrderModel> { }

export interface SearchDeliveryOrderResponsibilityRequest {
    phone: string
}

export interface SearchDeliveryOrderResponsibilityResponse {
    phone: string,
    fullname: string,
    address: string
}
export interface DeliveryOrderUpdateStatusModel {
    status?: string,
}

export interface PointModel {
    station?: StationModel,
    stationCode?: string,
    contactPhone: string,
    contactPerson: string,
    address?: string,
    location?: {
        lat?: string,
        long?: string
    },
    note?: string
}

export interface DeliveryPackageModel extends TrackableModel {
    code?: string,
    externalCode?: string,
    saleOrderCode?: string,
    name?: string,
    uom?: string,
    quantity?: number,
    weight?: number,
    length?: number,
    width?: number,
    height?: number
}

export interface DeliveryOrderModel {
    stt?:number,
    code?: string,
    parentCode?: string,
    groupCode?: string,
    driverCode?: string,
    coordinatorCode?: string,
    deliveryService?:string,
    sessionCode?: string,
    sessionStatus?:string,
    referenceCode?: string,
    productType?: string,
    sourceBy?: string,
    isToCustomer?: boolean,
    deliveryOrderLines?: DeliveryPackageModel[],
    childrens?: DeliveryOrderModel[],
    additional?: DataAttributeModel[],
    totalItems?: number,
    weight?: number,
    deliveryRouteSegmentId?: string,
    externalCode?: string,
    codAllowed?: boolean,
    codAmount?: number,
    codMethod?: string,
    expectedArrivalTime?: number,
    expectedStartTime?: number,
    expectedTimeConsumed?: number,
    actualArrivalTime?: number,
    actualStartTime?: number,
    actualTimeConsumed?: number,
    startStationCode?: string,
    startContactPerson?: string,
    startContactPhone?: string,
    startNote?: string,
    endStationCode?: string,
    endContactPerson?: string,
    endContactPhone?: string,
    endNote?: string,
    status?: string,
    transitOrder?: number,
    numberOfTransit?: number,
    threePLTeam?: string,
    createdAt?:number,
    driver?:EmployeeModel,
    coordinator?:EmployeeModel,
    startAddress?:AddressModel,
    endAddress?:AddressModel,

    // For presentation
    children?: DeliveryOrderModel[],
}
