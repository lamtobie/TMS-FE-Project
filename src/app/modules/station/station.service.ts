import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axiosClient from 'app/shared/axiosClient';
import { environment } from 'environments/environment';
import { PaginationParamsModel } from 'models/commons/requestModel';
import { DataResponseModel, ListResponseModel } from 'models/commons/responseModel';
import { StationModel } from 'models/station/stationModel';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class StationService{
    constructor(
        private httpClient: HttpClient
    ) { }
    
    public getStations(searchParam:PaginationParamsModel): Observable<ListResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/GetAll";
        return this.httpClient.get<ListResponseModel<StationModel>>(url,{params:searchParam});
    }
    public getStationByCode(code: string): Observable<DataResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/GetOne/" + code;
        return this.httpClient.get<DataResponseModel<StationModel>>(url);
    }
    public updateStation(data: StationModel): Observable<DataResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/Update/"+data.code;
        return this.httpClient.patch<DataResponseModel<StationModel>>(url, data);
    }
    public createStation(data: StationModel): Observable<DataResponseModel<StationModel>> {
        var url = environment.baseApi + "Station/Create";
        return this.httpClient.post<DataResponseModel<StationModel>>(url, data);
    }
}

