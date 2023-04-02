import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";

@Component({
    selector     : 'employee',
    templateUrl  : './employee.component.html',
    encapsulation: ViewEncapsulation.None
})
export class Station
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    dataStation: MatTableDataSource<StationModel>;
    data:StationModel[]=[
        {stt:1,code: '1',name:"Station A",contactPerson:"Tobie",contactPhone:'0329723060',contactEmail:"lam321093@gmail.com",createdAt:992001,status:'new'},
    ];
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
        )
    {
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      //this.initData();
      this.dataStation = new MatTableDataSource<StationModel>(this.data);
      this.dataStation.paginator=this.paginator;
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            employeetype: "",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
        }
    }
   

  
}