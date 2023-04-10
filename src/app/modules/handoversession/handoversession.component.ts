import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { DeliverySessionModel } from "models/deliverySession/deliverySessionModel";
import { StationModel } from "models/station/stationModel";

@Component({
    selector     : 'handoversession',
    templateUrl  : './handoversession.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HandoverSession
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
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
   

  
}
