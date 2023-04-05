import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { DeliveryOrderModel } from "models/deliveryOrder/deliveryOrderModel";

@Component({
    selector     : 'deliveryoder',
    templateUrl  : './deliveryoder.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DeliveryOder
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    dataStation: MatTableDataSource<DeliveryOrderModel>;
    data:DeliveryOrderModel[]=[
        {stt:1,code: '1',startAddress:"127 Phan Văn Trị",deliveryService:"Giao hàng nhanh",codAmount:5000000,threePLTeam:"Station A",driverCode:"LâmTobie-0329723060",status:'new'},
    ];
    displayCols2: string[] = [
        'stt',
        'docode',
        'childrencode',
        'numberofpackage',
        'status',
        'pickuppoint',
        'deliveryservice',
        'cod',
        'driver',
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
      this.dataStation = new MatTableDataSource<DeliveryOrderModel>(this.data);
      this.dataStation.paginator=this.paginator;
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            driver:"",
            coordinator:"",
            createday:"",
            deliveryday:"",
            finishday:"",
            pickuppoint:"",
            deliveryservice: "",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
        }
    }
   

  
}
