import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DataResponseModel, ListResponseModel } from "models/commons/responseModel";
import { DeliveryOrderModel } from "models/deliveryOrder/deliveryOrderModel";
import { DeliverySessionConfirmModel } from "models/deliverySession/assignDriverModel";
import { DeliverySessionModel } from "models/deliverySession/deliverySessionModel";
import { EmployeeModel } from "models/employee/employeeModel";
import { StationModel } from "models/station/stationModel";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class HandoverSessionService{
    constructor(
        private httpClient: HttpClient
    ) { }
    public getAll(searchParam:PaginationParamsModel): Observable<ListResponseModel<DeliverySessionModel>> {
        var url = environment.baseApi + "DeliverySession/GetAll";
        return this.httpClient.get<ListResponseModel<DeliverySessionModel>>(url,{params:searchParam});
    }
    public create(data: DeliverySessionModel): Observable<DataResponseModel<DeliverySessionModel>> {
        var url = environment.baseApi + "DeliverySession/Create";
        return this.httpClient.post<DataResponseModel<DeliverySessionModel>>(url, data);
    }
    public getOneByCode(code: string): Observable<DataResponseModel<DeliverySessionModel>> {
        var url = environment.baseApi + "DeliverySession/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<DeliverySessionModel>>(url);
    }
    public getDrivers(searchParam:PaginationParamsModel): Observable<ListResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetDrivers";
        return this.httpClient.get<ListResponseModel<EmployeeModel>>(url,{params:searchParam});
    }
    public getVehicles(searchParam:PaginationParamsModel): Observable<ListResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/GetAll";
        return this.httpClient.get<ListResponseModel<VehicleModel>>(url,{params:searchParam});
    }
    public getCoordinators(searchParam:PaginationParamsModel): Observable<ListResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetCoordinators";
        return this.httpClient.get<ListResponseModel<EmployeeModel>>(url,{params:searchParam});
    }
    public getStations(searchParam:PaginationParamsModel): Observable<ListResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/GetAll";
        return this.httpClient.get<ListResponseModel<StationModel>>(url,{params:searchParam});
    }
    public scanCode(codes: Array<string>): Observable<DataResponseModel<Array<DeliveryOrderModel>>> {
        var url = environment.baseApi + "DeliveryOrder/ScanCode";
        return this.httpClient.post<DataResponseModel<Array<DeliveryOrderModel>>>(url, codes);
    }
        
    public returnedSession(code:string, data: DeliverySessionConfirmModel): Observable<DataResponseModel<DeliverySessionConfirmModel>> {
        var url = environment.baseApi + "DeliverySession/Returned/"+code;
        return this.httpClient.post<DataResponseModel<DeliverySessionConfirmModel>>(url, data);
    }
}