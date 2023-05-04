export interface AssignDriverRequestModel {
    driverCode?: string,
    vehicleCode?: string,
    deliveryOrderCodes?: Array<string>,
    stationCode?: string,
    sessionCode?: string,
}

export interface  DeliverySessionConfirmModel {
    note?:string,
    reasonCancel?:string,
    excepted?:string,
    totalReceivedItems?:string,
    driverCode?:string,
}