import {
    HttpRequest,
    HttpClient,
    HttpEvent,
    HttpEventType,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
    FilePickerAdapter,
    UploadResponse,
    UploadStatus,
    FilePreviewModel,
} from 'ngx-awesome-uploader';
import { environment } from 'environments/environment';
import { UploadInfo } from 'models/upload/uploadinfo';

export class FilePickAdapter extends FilePickerAdapter {
    private proDocController: string;

    constructor(private http: HttpClient, private option?: UploadInfo) {
        super();
    }
    
    public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
        const form = new FormData();
        form.append('file', fileItem.file);
        form.append('filename', fileItem.fileName);
        form.append('name', fileItem.name);
        form.append('folder', 'Resources/Avatar');

        // Upload documents for project
     
        var api = environment.baseApi + 'Employee/UploadAvatar';

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
