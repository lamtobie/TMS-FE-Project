import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DataResponseModel, ListResponseModel } from "models/commons/responseModel";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class VehicleService{
    constructor(
        private httpClient: HttpClient
    ) { }

    public getVehicles(searchParam:PaginationParamsModel): Observable<ListResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/GetAll";
        return this.httpClient.get<ListResponseModel<VehicleModel>>(url,{params:searchParam});
    }
    public getVehicleByCode(code: string): Observable<DataResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<VehicleModel>>(url);
    }
    public updateVehicle(data: VehicleModel): Observable<DataResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/Update/"+data.code;
        return this.httpClient.patch<DataResponseModel<VehicleModel>>(url, data);
    }
    public createVehicle(data: VehicleModel): Observable<DataResponseModel<VehicleModel>> {
        var url = environment.baseApi + "Vehicle/Create";
        return this.httpClient.post<DataResponseModel<VehicleModel>>(url, data);
    }
    public getVehicleTypes(searchParam:PaginationParamsModel): Observable<ListResponseModel<VehicleTypeModel>> {
        var url = environment.baseApi + "VehicleType/GetAll";
        return this.httpClient.get<ListResponseModel<VehicleTypeModel>>(url,{params:searchParam});
    }
}