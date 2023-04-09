import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";

@Component({
    selector     : 'vehicletype',
    templateUrl  : './vehicletype.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehicleType
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    dataVehicleType: MatTableDataSource<VehicleTypeModel>;
    data:VehicleTypeModel[]=[
        //{stt:1,code: '1',vehicleInfo:"Station A",contactPerson:"Tobie",contactPhone:'0329723060',contactEmail:"lam321093@gmail.com",createdAt:992001,status:'new'},
    ];
    displayCols2: string[] = [
        'stt',
        'code',
        'name',
        'height',
        'maximumCapacity',
        'maximumPayload',
        'status',
        'createAt',
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
      this.dataVehicleType = new MatTableDataSource<VehicleTypeModel>(this.data);
      this.dataVehicleType.paginator=this.paginator;
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
        }
    }
}
