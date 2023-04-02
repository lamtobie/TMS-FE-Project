import { DataAttributeModel } from "../attribute/dataAttributeModel";
import { DeliveryPackageModel } from "./deliveryOrderModel";

export interface PickupInfoModel
{
    startAddress: string,
    startContactPerson: string,
    startContactPhone: string,
    expectedStartTime?: number,
    startNote?: string,
}

export interface DropoffInfoModel
{
    endAddress?: string,
    endContactPerson?: string,
    endContactPhone?: string,
    endNote?: string,
    isToCustomer?: boolean,
    expectedArrivalTime?: number,
    expectedTimeConsumed?: number,
    referenceCode?: string,
    threePLTeam?: string,
    productType?: string,
    totalItems?: number,
    weight?: number,
    codAllowed?: boolean,
    codAmount?: number,
    codMethod?: string,
    deliveryOrderLines?: DeliveryPackageModel[],
    additional?: DataAttributeModel[],
}

export interface DeliveryOrderManyDropoffCreationModel {
    pickupInfo: PickupInfoModel,
    dropoffInfo: Array<DropoffInfoModel>
}