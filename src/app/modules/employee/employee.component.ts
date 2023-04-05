import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { List } from "lodash";
import { EmployeeModel } from "models/employee/employeeModel";

@Component({
    selector     : 'employee',
    templateUrl  : './employee.component.html',
    encapsulation: ViewEncapsulation.None
})
export class Employee
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    dataStation: MatTableDataSource<EmployeeModel>;
    data:EmployeeModel[]=[
        {stt:1,code: '1',fullName:"Lâm Tobie",employeeType:"Driver",mobilePhone:'0329723060',threePLTeam:"Station A",service:"Giao hàng nhanh", createdAt:992001,status:'new'},
    ];
    displayCols2: string[] = [
        'stt',
        'code',
        'name',
        'phone',
        'type',
        'station',
        'ismanager',
        'service',
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
      this.dataStation = new MatTableDataSource<EmployeeModel>(this.data);
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
