import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";
import { VehicleModel, ViewVehicleModel } from "models/vehicle/vehicleModel";

@Component({
    selector     : 'vehicle',
    templateUrl  : './vehicle.component.html',
    encapsulation: ViewEncapsulation.None
})
export class Vehicle
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    dataVehicle: MatTableDataSource<ViewVehicleModel>;
    data:ViewVehicleModel[]=[
        //{stt:1,code: '1',vehicleInfo:"Station A",contactPerson:"Tobie",contactPhone:'0329723060',contactEmail:"lam321093@gmail.com",createdAt:992001,status:'new'},
    ];
    displayCols2: string[] = [
        'stt',
        'vehicleid',
        'vehicletypename',
        'hight',
        'maximumCapacity',
        'maximumPayload',
        'status',
        'createDate',
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
      this.dataVehicle = new MatTableDataSource<ViewVehicleModel>(this.data);
      this.dataVehicle.paginator=this.paginator;
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
}
