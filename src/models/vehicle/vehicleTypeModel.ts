import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';

export interface InitVehicleTypePageState extends InitCategoryPageState<VehicleTypeModel> { }

export interface VehicleTypeModel extends TrackableModel {
    code: string,
    name: string,
    status?: string,
    length?: number,
    width?: number,
    height?: number,
    maximumCapacity?: number,
    maximumPayload?: number,
    createAt?: string,
}