import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { List } from "lodash";
import { DeliverySessionModel } from "models/deliverySession/deliverySessionModel";
import { StationModel } from "models/station/stationModel";
import * as XLSX from 'xlsx';


@Component({
    selector     : 'handoversession',
    templateUrl  : './handoversession.component.html',
    styleUrls:['./handoversession.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [ fuseAnimations,
        trigger('detailStaff', [
            state('collapsed', style({ height: '0px', minHeight: '0'})),
            state('expanded', style({ height: '*'})),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})
export class HandoverSession
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    fileName= 'Report.xlsx';
    dataStation: MatTableDataSource<DeliverySessionModel>;
    data:DeliverySessionModel[]=[
        {stt:1,code: '1',status:'new',startStationCode:'273 An Dương Vương',endStationCode:'127 Phan Văn Trị', coordinatorCode:'Cathy',driverCode:'Tobie',vehicleCode:"Máy bay",totalDOs:1,totalDPs:5},
    ];
    displayCols2: string[] = [
        'stt',
        'code',
        'status',
        'start',
        'end',
        'coordinator',
        'driver',
        'vehicle',
        'dos',
        'pks',
        'action'
    ];
    staffElement: DeliverySessionModel | null;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        )
    {
    }

    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      //this.initData();
      this.dataStation = new MatTableDataSource<DeliverySessionModel>(this.data);
      this.dataStation.paginator=this.paginator;
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            coordinator:"",
            driver:"",
            pickuppoint:"",
            endpoint:"",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
            status: "",
          });
        }
    }
   
    selectElement(element: any, event: Event) {
        this.staffElement = this.staffElement === element ? null : element
}
convertNumToDate(num:number){
    var date = new Date(num)
    return date.toLocaleDateString('en-GB');
}
exportExcel(){
    /* pass here the table id */
    let element = document.getElementById('table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
}
  
}
