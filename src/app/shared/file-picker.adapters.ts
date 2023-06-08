import { FilePreviewModel } from 'ngx-awesome-uploader';
import { Observable } from 'rxjs';
export interface UploadResponse {
    body?: any;
    status: UploadStatus;
    progress?: number;
}
export declare enum UploadStatus {
    UPLOADED = "UPLOADED",
    IN_PROGRESS = "IN PROGRESS",
    ERROR = "ERROR"
}
export abstract class FilePickerAdapters {
    abstract uploadFile(fileItem: FilePreviewModel,code:string): Observable<UploadResponse>;
    abstract removeFile(fileItem: FilePreviewModel): Observable<any>;
}
