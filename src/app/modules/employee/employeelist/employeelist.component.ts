import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { List } from "lodash";
import { EmployeeModel } from "models/employee/employeeModel";
import { EmployeeService } from "../employee.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatDialog } from "@angular/material/dialog";
import { PaginationParamsModel } from "models/commons/requestModel";
import { Location } from "@angular/common";
import moment from "moment";
import { ChangePassword } from "../changepassword/changepassword.component";
import * as XLSX from 'xlsx';


@Component({
    selector     : 'employeelist',
    templateUrl  : './employeelist.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EmployeeList
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    fileName= 'Report.xlsx';
    dataEmployee: MatTableDataSource<EmployeeModel>;
    alert:any;
    searchParam:PaginationParamsModel;
    data:EmployeeModel[];
    employee:EmployeeModel;
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
        private route:Router,
        private location:Location,
        private employeeService:EmployeeService,
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
     this.getEmployees();
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
   
    getEmployees(){
        if(this.supportForm.controls["range"].value.start=='' && this.supportForm.controls["range"].value.end==''){
            var startDate= new Date("01/01/1000").getTime();
            var endDate= new Date("01/01/9999").getTime();
        }
        else{
            var startDate= moment(this.supportForm.controls["range"].value.start).toDate().getTime();
            var endDate= moment(this.supportForm.controls["range"].value.end).toDate().getTime();
        }
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status, EmployeeType:this.supportForm.value.employeetype, CreatedAt:startDate+':'+endDate};
        this.employeeService.getEmployees(this.searchParam).subscribe({next : (data) => {
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
                this.dataEmployee = new MatTableDataSource<EmployeeModel>(this.data);
                this.dataEmployee.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    refresh(){
        this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            employeetype: "",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
          this.getEmployees();
    }

    convertNumToDate(num:number){
        var date = new Date(num)
        return date.toLocaleDateString('en-GB');
    }

    updateEmployeeStatus(code:string, status:string){
        this.employeeService.getEmployeeByCode(code).subscribe({next : (data) => {
            if (data) {
                this.employee=data.data;
                this.employee.status=status;
                this.employeeService.updateEmployee(this.employee).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update successfully for employee '+code,
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
                               this.getEmployees();
                            });
                        } else {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Failed',
                                message: 'Update failed for employee '+code,
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
                               this.getEmployees();
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

    openChangePassword(code:string) {
        const newScreen = this._matDialog.open(ChangePassword, {
          height: "450px",
          width: "600px",
          autoFocus: false,
          data: {employeeCode:code},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getEmployees();
          } else {
            this.getEmployees();
          }
        });
      }

    moveToDriverNew() {
        this.route.navigateByUrl("/drivernew");
    }

    moveToCoordinatorNew() {
        this.route.navigateByUrl("/coordinatornew");
    }
    viewItem(code:string, type:string, event: Event) {
        if (type=='driver'){
            event.stopPropagation();
            this.route.navigateByUrl('/drivernew', { state: { requestId: code, mode:'view' } });
        }
        if (type=='coordinator'){
            event.stopPropagation();
            this.route.navigateByUrl('/coordinatornew', { state: { requestId: code, mode:'view' } });
        }
    }
    editItem(code:string, type:string, event: Event) {
        if (type=='driver'){
            event.stopPropagation();
            this.route.navigateByUrl('/drivernew', { state: { requestId: code, mode:'edit' } });
        }
        if (type=='coordinator'){
            event.stopPropagation();
            this.route.navigateByUrl('/coordinatornew', { state: { requestId: code, mode:'edit' } });
        }
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
