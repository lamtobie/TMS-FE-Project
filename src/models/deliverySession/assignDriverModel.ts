export interface AssignDriverRequestModel {
    driverCode: string,
    vehicleCode: string,
    deliveryOrderCodes: Array<string>,
    endStationCode?: string,
    sessionCode?: string,
}