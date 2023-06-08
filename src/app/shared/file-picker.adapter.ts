import {
    HttpRequest,
    HttpClient,
    HttpEvent,
    HttpEventType,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
    UploadResponse,
    UploadStatus,
    FilePreviewModel,
} from 'ngx-awesome-uploader';
import { environment } from 'environments/environment';
import { UploadInfo } from 'models/upload/uploadinfo';
import { FilePickerAdapters } from './file-picker.adapters';

export class FilePickAdapter extends FilePickerAdapters {
    private proDocController: string;

    constructor(private http: HttpClient, private option?: UploadInfo) {
        super();
    }
    
    public uploadFile(fileItem: FilePreviewModel, code:string): Observable<UploadResponse> {
        const form = new FormData();
        form.append('file', fileItem.file);
        form.append('filename', fileItem.fileName);
        form.append('folder', 'Resources/Avatar');

        // Upload documents for project
     
        var api = environment.baseApi + 'Employee/UploadAvatar/'+code;

        const req = new HttpRequest('POST', api, form, {
            reportProgress: true,
        });
        return this.http.request(req).pipe(
            map((res: HttpEvent<any>) => {
                if (res.type === HttpEventType.Response) {
                    const responseFromBackend = res.body;
                    return {
                        body: responseFromBackend,
                        status: UploadStatus.UPLOADED,
                    };
                } else if (res.type === HttpEventType.UploadProgress) {
                    /** Compute and show the % done: */
                    const uploadProgress = +Math.round(
                        (100 * res.loaded) / res.total
                    );
                    return {
                        status: UploadStatus.IN_PROGRESS,
                        progress: uploadProgress,
                    };
                }
            }),
            catchError((er) => {
                console.log(er);
                return of({ status: UploadStatus.ERROR, body: er });
            })
        );
    }
    public uploadIdentityPicture(fileItem: FilePreviewModel, code:string): Observable<UploadResponse> {
        const form = new FormData();
        form.append('file', fileItem.file);
        form.append('filename', fileItem.fileName);
        form.append('folder', 'Resources/Identity');

        // Upload documents for project
     
        var api = environment.baseApi + 'Employee/UploadIdentity/'+code;

        const req = new HttpRequest('POST', api, form, {
            reportProgress: true,
        });
        return this.http.request(req).pipe(
            map((res: HttpEvent<any>) => {
                if (res.type === HttpEventType.Response) {
                    const responseFromBackend = res.body;
                    return {
                        body: responseFromBackend,
                        status: UploadStatus.UPLOADED,
                    };
                } else if (res.type === HttpEventType.UploadProgress) {
                    /** Compute and show the % done: */
                    const uploadProgress = +Math.round(
                        (100 * res.loaded) / res.total
                    );
                    return {
                        status: UploadStatus.IN_PROGRESS,
                        progress: uploadProgress,
                    };
                }
            }),
            catchError((er) => {
                console.log(er);
                return of({ status: UploadStatus.ERROR, body: er });
            })
        );
    }
    public uploadLicensePicture(fileItem: FilePreviewModel, code:string): Observable<UploadResponse> {
        const form = new FormData();
        form.append('file', fileItem.file);
        form.append('filename', fileItem.fileName);
        form.append('folder', 'Resources/License');

        // Upload documents for project
     
        var api = environment.baseApi + 'Employee/UploadLicense/'+code;

        const req = new HttpRequest('POST', api, form, {
            reportProgress: true,
        });
        return this.http.request(req).pipe(
            map((res: HttpEvent<any>) => {
                if (res.type === HttpEventType.Response) {
                    const responseFromBackend = res.body;
                    return {
                        body: responseFromBackend,
                        status: UploadStatus.UPLOADED,
                    };
                } else if (res.type === HttpEventType.UploadProgress) {
                    /** Compute and show the % done: */
                    const uploadProgress = +Math.round(
                        (100 * res.loaded) / res.total
                    );
                    return {
                        status: UploadStatus.IN_PROGRESS,
                        progress: uploadProgress,
                    };
                }
            }),
            catchError((er) => {
                console.log(er);
                return of({ status: UploadStatus.ERROR, body: er });
            })
        );
    }


    public removeFile(fileItem: FilePreviewModel): Observable<any> {
        return of(fileItem);
    }

    public remove(id: number): Observable<any> {
        var url = environment.baseApi + 'fileupload/removefile';
        return this.http.post(url, { id });
    }

    public removeDocument(data: UploadInfo): Observable<any> {
      var url = environment.baseApi + 'fileupload/removedocument';
      return this.http.post(url, data);
  }
}
