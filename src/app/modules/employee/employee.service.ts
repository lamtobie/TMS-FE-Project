import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AddressModel } from "models/address/addressModel";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DataResponseModel, ListResponseModel } from "models/commons/responseModel";
import { EmployeeModel } from "models/employee/employeeModel";
import { StationModel } from "models/station/stationModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EmployeeService{
    constructor(
        private httpClient: HttpClient
    ) { }

    public getEmployees(searchParam:PaginationParamsModel): Observable<ListResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetAll";
        return this.httpClient.get<ListResponseModel<EmployeeModel>>(url,{params:searchParam});
    }
    public getEmployeeByCode(code: string): Observable<DataResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<EmployeeModel>>(url);
    }
    public updateEmployee(data: EmployeeModel): Observable<DataResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/Update/"+data.code;
        return this.httpClient.patch<DataResponseModel<EmployeeModel>>(url, data);
    }
    public getAddresses(searchParam:PaginationParamsModel): Observable<ListResponseModel<AddressModel>> {
        var url = environment.baseApi + "Address/GetAll";
        return this.httpClient.get<ListResponseModel<AddressModel>>(url,{params:searchParam});
    }
    
    public getStations(searchParam:PaginationParamsModel): Observable<ListResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/GetAll";
        return this.httpClient.get<ListResponseModel<StationModel>>(url,{params:searchParam});
    }
    public createDriver(data: EmployeeModel): Observable<DataResponseModel<EmployeeModel>> {
        var url = environment.baseApi + "Employee/Create";
        return this.httpClient.post<DataResponseModel<EmployeeModel>>(url, data);
    }
}