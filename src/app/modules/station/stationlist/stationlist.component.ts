import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";
import { StationService } from "../station.service";
import { PaginationParamsModel } from "models/commons/requestModel";
import { StationNew } from "../stationnew/stationnew.component";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { CONSTANT } from "app/shared/constants";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import * as XLSX from 'xlsx';

@Component({
    selector     : 'stationlist',
    templateUrl  : './stationlist.component.html',
    encapsulation: ViewEncapsulation.None
})
export class StationList
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    alert: any;
    fileName= 'Report.xlsx';
    searchParam:PaginationParamsModel;
    station:StationModel;
    dataStation: MatTableDataSource<StationModel>;
    data:StationModel[];
    displayCols2: string[] = [
        'stt',
        'stationid',
        'stationname',
        'user',
        'phonenumber',
        'email',
        'datecreate',
        'status',
        'action'
    ];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route:Router,
        private location:Location,
        private stationService:StationService,
        private _fuseAlertnService: FuseConfirmationService,
        private _matDialog: MatDialog,
        )
    {
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      //this.initData();
      this.getStations();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
          });
        }
    }
   
    moveToStationNew() {
        this.route.navigateByUrl("/stationnew");
    }

    getStations(){
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status};
        this.stationService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.data=data.data.items;
                this.data.forEach(d=>{
                    if (d.code!=null){
                        d.stt=temp;
                        temp++;
                    }
                });
                this.dataStation = new MatTableDataSource<StationModel>(this.data);
                this.dataStation.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    updateStationStatus(code:string, status:string){
        this.stationService.getStationByCode(code).subscribe({next : (data) => {
            if (data) {
                this.station=data.data;
                this.station.status=status;
                this.stationService.updateStation(this.station).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update successfully for station '+code,
                                icon       : {
                                    show : true,
                                    name : 'heroicons_outline:check-circle',
                                    color: 'success'
                                },
                                actions    : {
                                    confirm: {
                                        show : false,
                                        label: 'Confirm',
                                        color: 'warn'
                                    },
                                    cancel : {
                                        show : true,
                                        label: 'OK'
                                    }
                                },
                            });
                            confirmation.afterClosed().subscribe((result) => {
                               this.getStations();
                            });
                        } else {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Failed',
                                message: 'Update failed for station '+code,
                                icon       : {
                                    show : true,
                                    name : 'heroicons_outline:exclamation',
                                    color: 'error'
                                },
                                actions    : {
                                    confirm: {
                                        show : false,
                                        label: 'Confirm',
                                        color: 'warn'
                                    },
                                    cancel : {
                                        show : true,
                                        label: 'OK'
                                    }
                                },
                            });
                            confirmation.afterClosed().subscribe((result) => {
                               this.getStations();
                            });        
                        }
                    },
                    error: (err) => {
                        this.alert = {
                            type: 'error',
                            message:
                                "Cannot connect to server.",
                        };
                    },
                });  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    convertNumToDate(num:number){
        var date = new Date(num)
        return date.toLocaleDateString('en-GB');
    }

   refresh(){
        this.supportForm = this._formBuilder.group({
          keyword: "",
          status: "",
        });
        this.getStations();
    }

    viewItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/stationnew', { state: { requestId: code, mode:'view' } });
    }

    editItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/stationnew', { state: { requestId: code, mode:'edit' } });
    }

    exportexcel(){
      /* pass here the table id */
      let element = document.getElementById('table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
   
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
      /* save to file */  
      XLSX.writeFile(wb, this.fileName);
   
    }
    onBack() {
        this.location.back();
    }
  
}
