import { InitCategoryPageState } from '../common/initStateModel';
import { TrackableModel } from '../common/trackableModel';

export interface InitVehicleTypePageState extends InitCategoryPageState<VehicleType> { }

export interface VehicleType extends TrackableModel {
    code: string,
    name: string,
    status?: string,
    length?: number,
    width?: number,
    height?: number,
    maximumCapacity?: number,
    maximumPayload?: number
}