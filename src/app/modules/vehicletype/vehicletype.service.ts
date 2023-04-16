import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DataResponseModel, ListResponseModel } from "models/commons/responseModel";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class VehicleTypeService{
    constructor(
        private httpClient: HttpClient
    ) { }

    public getVehicleTypes(searchParam:PaginationParamsModel): Observable<ListResponseModel<VehicleTypeModel>> {
        var url = environment.baseApi + "VehicleType/GetAll";
        return this.httpClient.get<ListResponseModel<VehicleTypeModel>>(url,{params:searchParam});
    }
    public getVehicleTypenByCode(code: string): Observable<DataResponseModel<VehicleTypeModel>> {
        var url = environment.baseApi + "VehicleType/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<VehicleTypeModel>>(url);
    }
    public updateVehicleType(data: VehicleTypeModel): Observable<DataResponseModel<VehicleTypeModel>> {
        var url = environment.baseApi + "VehicleType/Update/"+data.code;
        return this.httpClient.patch<DataResponseModel<VehicleTypeModel>>(url, data);
    }
    public createVehicleType(data: VehicleTypeModel): Observable<DataResponseModel<VehicleTypeModel>> {
        var url = environment.baseApi + "VehicleType/Create";
        return this.httpClient.post<DataResponseModel<VehicleTypeModel>>(url, data);
    }
}