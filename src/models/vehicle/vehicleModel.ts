import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';

export interface InitVehiclePageState extends InitCategoryPageState<VehicleModel> { }

export interface VehicleModel extends TrackableModel {
    code: string,
    vehicleTypeCode: string,
    numberPlate: string,
    status?: string,
    createAt?: string,
}


