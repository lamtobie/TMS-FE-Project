import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DataResponseModel, ListResponseModel } from "models/commons/responseModel";
import { DeliveryOrderManyDropoffCreationModel } from "models/deliveryOrder/deliveryOrderCreationModel";
import { DeliveryOrderModel, DeliveryOrderUpdateStatusModel } from "models/deliveryOrder/deliveryOrderModel";
import { AssignDriverRequestModel, DeliverySessionConfirmModel } from "models/deliverySession/assignDriverModel";
import { EmployeeModel } from "models/employee/employeeModel";
import { StationModel } from "models/station/stationModel";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DeliveryOrderService{
    constructor(
        private httpClient: HttpClient
    ) { }
    public getDeliveryOrders(searchParam:PaginationParamsModel): Observable<ListResponseModel<DeliveryOrderModel>> {
        var url = environment.baseApi + "DeliveryOrder/GetAll";
        return this.httpClient.get<ListResponseModel<DeliveryOrderModel>>(url,{params:searchParam});
    }
    public getDeliveryOrderByCode(code: string): Observable<DataResponseModel<DeliveryOrderModel>> {
        var url = environment.baseApi + "DeliveryOrder/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<DeliveryOrderModel>>(url);
    }
    public updateDeliveryOrder(data: DeliveryOrderModel): Observable<DataResponseModel<DeliveryOrderModel>> {
        var url = environment.baseApi + "DeliveryOrder/Update/"+data.code;
        return this.httpClient.patch<DataResponseModel<DeliveryOrderModel>>(url, data);
    }
    public getDrivers(searchParam:PaginationParamsModel): Observable<ListResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetDrivers";
        return this.httpClient.get<ListResponseModel<EmployeeModel>>(url,{params:searchParam});
    }
    public getCoordinators(searchParam:PaginationParamsModel): Observable<ListResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetCoordinators";
        return this.httpClient.get<ListResponseModel<EmployeeModel>>(url,{params:searchParam});
    }
    public getStations(searchParam:PaginationParamsModel): Observable<ListResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/GetAll";
        return this.httpClient.get<ListResponseModel<StationModel>>(url,{params:searchParam});
    }
    public getVehicles(searchParam:PaginationParamsModel): Observable<ListResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/GetAll";
        return this.httpClient.get<ListResponseModel<VehicleModel>>(url,{params:searchParam});
    }
    public getVehicleByCode(code: string): Observable<DataResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<VehicleModel>>(url);
    }
    public assignDriver(data: AssignDriverRequestModel): Observable<DataResponseModel<AssignDriverRequestModel>> {
        var url = environment.baseApi + "DeliverySession/AssignDriverToDO";
        return this.httpClient.post<DataResponseModel<AssignDriverRequestModel>>(url, data);
    }
    public createDeliveryOrderWithManyDropOff(data: DeliveryOrderManyDropoffCreationModel): Observable<DataResponseModel<DeliveryOrderManyDropoffCreationModel>> {
        var url = environment.baseApi + "DeliveryOrder/CreateManyDropoff";
        return this.httpClient.post<DataResponseModel<DeliveryOrderManyDropoffCreationModel>>(url, data);
    }
    
    public cancelOrder(code:string, data: DeliverySessionConfirmModel): Observable<DataResponseModel<DeliverySessionConfirmModel>> {
        var url = environment.baseApi + "DeliverySession/Cancel/"+code;
        return this.httpClient.post<DataResponseModel<DeliverySessionConfirmModel>>(url, data);
    }
    public changeStatus(code:string, data: DeliveryOrderUpdateStatusModel): Observable<DataResponseModel<DeliveryOrderUpdateStatusModel>> {
        var url = environment.baseApi + "DeliveryOrder/ChangeStatus/"+code;
        return this.httpClient.post<DataResponseModel<DeliveryOrderUpdateStatusModel>>(url, data);
    }
    
}