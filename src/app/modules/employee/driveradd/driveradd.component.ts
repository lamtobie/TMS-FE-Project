import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Route, Router } from "@angular/router";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";
import { AWARD_LIST, CITY_LIST, DISTRICT_LIST, REGION_LIST } from "app/shared/province";
import { AddressModel } from "models/address/addressModel";
import { CONSTANT } from "app/shared/constants";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { FuseAlertService } from "@fuse/components/alert";
import { PaginationParamsModel } from "models/commons/requestModel";
import { StationService } from "app/modules/station/station.service";
import { EmployeeModel } from "models/employee/employeeModel";
import { EmployeeService } from "../employee.service";
import { FilePickerComponent } from "ngx-awesome-uploader";
import { HttpClient } from "@angular/common/http";
import { FilePickAdapter } from "app/shared/file-picker.adapter";

@Component({
    selector     : 'driveradd',
    templateUrl  : './driveradd.component.html',
    styleUrls:['./driveradd.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DriverAdd
{
    @ViewChild('uploader', { static: true }) uploader: FilePickerComponent;
    @ViewChild('identity', { static: true }) identity: FilePickerComponent;
    @ViewChild('license', { static: true }) license: FilePickerComponent;
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    public adapter = new FilePickAdapter(this.http);
    public identityAdapter = new FilePickAdapter(this.http);
    public licenseAdapter = new FilePickAdapter(this.http);

    supportForm: FormGroup;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    isAddShow:boolean=true;
    PAGEMODE: string='new';
    employeeCode:string;
    params: any;
    photos: string[] = [];
    identityPhotos: string[] = [];
    licensePhotos: string[] = [];
    services:string[];
    employee:EmployeeModel;
    employeeEdited:EmployeeModel={};
    addresses:AddressModel[];
    stationList:StationModel[];
    address:AddressModel={};
    alert:any;
    temp:number=1;
    employeeName:string;
    searchParam:PaginationParamsModel;
    regionList=REGION_LIST;
    cityList=CITY_LIST;
    districtList=DISTRICT_LIST;
    wardList=AWARD_LIST;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private location:Location,
        private employeeService:EmployeeService,
        private _fuseAlertnService: FuseConfirmationService,
        private http: HttpClient,
        private route:Router,
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.employeeCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.employeeCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getStaitonField();
            this.getViewEmployeeByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getStaitonField();
            this.getEditEmployeeByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE== "new"){
            this.createForm();
            this.generateEmployeeCode();
            this.getStaitonField();
            
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
      //this.initData();
      this.uploader.enableAutoUpload=false
      this.identity.enableAutoUpload=false;
      this.license.enableAutoUpload=false;

  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            email:["", Validators.required],
            password:["", Validators.required],
            idnumber:["", Validators.required],
            services:["", Validators.required],
            address:["", Validators.required],
            phone:["", Validators.required],
            station:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            status:"active"
          });
        }
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            email:["", Validators.required],
            password:["", Validators.required],
            idnumber:["", Validators.required],
            services:["", Validators.required],
            address:["", Validators.required],
            phone:["", Validators.required],
            station:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            status:"active"
          });
    }

    createEmployee(){
        var services=this.supportForm.get('services').value;

        this.employeeEdited.code=this.supportForm.get('code').value;
        this.employeeEdited.employeeType='driver'
        this.employeeEdited.fullName=this.supportForm.get('name').value;
        this.employeeEdited.email=this.supportForm.get('email').value;
        this.employeeEdited.password=this.supportForm.get('password').value;
        this.employeeEdited.identityNumber=this.supportForm.get('idnumber').value;
        this.employeeEdited.services=services[0]+","+services[1];
        this.employeeEdited.mobilePhone=this.supportForm.get('phone').value;
        this.employeeEdited.status='active';
        this.employeeEdited.stationCode=this.supportForm.get('station').value;
        this.address.text=this.supportForm.get('address').value;
        this.address.lat= this.convertStr2Num(this.supportForm.get('lat').value);
        this.address.long=this.convertStr2Num(this.supportForm.get('long').value);
        this.address.slicRegion=this.supportForm.get('region').value;
        this.address.slicProvince=this.supportForm.get('province').value;
        this.address.slicDistrict=this.supportForm.get('district').value;
        this.address.slicWard=this.supportForm.get('ward').value;
        this.address.slicCode=this.employeeCode;
        this.address.slicLabel=this.supportForm.get('ward').value;
        this.address.slicLevel="Phuong"
        this.employeeEdited.address=this.address;
        this.employeeService.createEmployee(this.employeeEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    if (this.uploader.files.length>0)
                    this.adapter.uploadFile(this.uploader.files[0],this.employeeCode).subscribe();      
                    if (this.identity.files.length>0)
                    this.adapter.uploadIdentityPicture(this.identity.files[0],this.employeeCode).subscribe();    
                    if (this.license.files.length>0)
                    this.adapter.uploadLicensePicture(this.license.files[0],this.employeeCode).subscribe();            
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create successfully for driver '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create failed for driver '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
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

    onBack() {
        this.location.back();
    }
   
    getViewEmployeeByCode(){
        this.employeeService.getEmployeeByCode(this.employeeCode).subscribe({next : (data) => {
            if (data) {
                this.services = data.data.services.split(",");
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [{value:data.data.fullName, disabled:true}],
                    email:[{value:data.data.email, disabled:true}],
                    password:[{value:data.data.password, disabled:true}],
                    idnumber:[{value:data.data.identityNumber, disabled:true}],
                    services:[this.services, Validators.required],
                    address:[{value:data.data.address.text, disabled:true}],
                    phone:[{value:data.data.mobilePhone, disabled:true}],
                    station:[data.data.stationCode, Validators.required],
                    lat:[{value:data.data.address.lat, disabled:true}],
                    long:[{value:data.data.address.long, disabled:true}],
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status,
                  });
                  this.employeeName=data.data.fullName;
                  this.getPhotos(data.data.avatarPicture);
                  this.getIdentityPhotos(data.data.identityNumberPicture);
                  this.getLicensePhotos(data.data.drivingLicensePicture);
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
        this.supportForm.disable();
    }

    getEditEmployeeByCode(){
        this.employeeService.getEmployeeByCode(this.employeeCode).subscribe({next : (data) => {
            if (data) {
                this.services = data.data.services.split(",");
                this.employee=data.data;
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [data.data.fullName, Validators.required],
                    email:[data.data.email, Validators.required],
                    password:[data.data.password, Validators.required],
                    idnumber:[data.data.identityNumber, Validators.required],
                    services:[this.services, Validators.required],
                    address:[data.data.address.text, Validators.required],
                    phone:[data.data.mobilePhone, Validators.required],
                    station:[data.data.stationCode, Validators.required],
                    lat:[data.data.address.lat, Validators.required],
                    long:[data.data.address.long, Validators.required],
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status
                  });
                  this.employeeName=data.data.fullName;
                  this.getPhotos(data.data.avatarPicture);
                  this.getIdentityPhotos(data.data.identityNumberPicture);
                  this.getLicensePhotos(data.data.drivingLicensePicture);
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToEmployee() {
        this.route.navigateByUrl("/employee");
    }
    getPhotos(name:string){
        if (name){
            var form=document.getElementById('uploader');
            form.style.display='none';
            this.employeeService.getPhotos(name).subscribe(data => this.photos = data['photos']);
        }
      
    }
    getIdentityPhotos(name:string){
        if (name){
            var form=document.getElementById('identity');
            form.style.display='none';
            this.employeeService.getIdentityPhotos(name).subscribe(data => this.identityPhotos = data['photos']);
        }   
    }
    getLicensePhotos(name:string){
        if (name){
            var form=document.getElementById('license');
            form.style.display='none';
            this.employeeService.getLicensePhotos(name).subscribe(data => this.licensePhotos = data['photos']);
        }   
    }
    public createImgPath = (serverPath: string) => { 
        return `https://localhost:7229/${serverPath}`; 
      }
    updateEmployee(){
        this.employeeEdited=this.employee;
        var services=this.supportForm.get('services').value;
        var textServices="";
        for (var i=0;i<services.length-1;i++){
            textServices += services[i]+",";
        }
        if (services.length>0){
            textServices += services[services.length-1];
        }
        this.employeeEdited.employeeType='driver'
        this.employeeEdited.fullName=this.supportForm.get('name').value;
        this.employeeEdited.email=this.supportForm.get('email').value;
        this.employeeEdited.password=this.supportForm.get('password').value;
        this.employeeEdited.identityNumber=this.supportForm.get('idnumber').value;
        this.employeeEdited.services=textServices;
        this.employeeEdited.mobilePhone=this.supportForm.get('phone').value;
        this.employeeEdited.status='active';
        this.employeeEdited.stationCode=this.supportForm.get('station').value;
        this.address.text=this.supportForm.get('address').value;
        this.address.lat= this.convertStr2Num(this.supportForm.get('lat').value);
        this.address.long=this.convertStr2Num(this.supportForm.get('long').value);
        this.address.slicRegion=this.supportForm.get('region').value;
        this.address.slicProvince=this.supportForm.get('province').value;
        this.address.slicDistrict=this.supportForm.get('district').value;
        this.address.slicWard=this.supportForm.get('ward').value;
        this.address.slicCode=this.employeeCode;
        this.address.slicLabel=this.supportForm.get('ward').value;
        this.address.slicLevel="Phuong"
        this.employeeEdited.address=this.address;

        this.employeeService.updateEmployee(this.employeeEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    if (this.uploader.files.length>0)
                    this.adapter.uploadFile(this.uploader.files[0],this.employeeCode).subscribe();      
                    if (this.identity.files.length>0)
                    this.adapter.uploadIdentityPicture(this.identity.files[0],this.employeeCode).subscribe();    
                    if (this.license.files.length>0)
                    this.adapter.uploadLicensePicture(this.license.files[0],this.employeeCode).subscribe();     

                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Update successfully for employee '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Update failed for station '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
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

    convertStr2Num(value: string): number {
        value = value.toString().split('.').join('');
        value = value.replace(',', '.');
        return parseFloat(value);
    }

 
    generateEmployeeCode(){
        this.searchParam={Keyword:'', Status:''};
        this.employeeService.getEmployees(this.searchParam).subscribe({next : (data) => {
            if (data) {
                data.data.items.forEach(d=>{
                    if (d.code!=null){
                        this.temp++;
                    }
                });
                this.employeeCode='EPL'+this.temp
                this.supportForm.patchValue({'code': this.employeeCode});
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    getStaitonField(){
        this.searchParam={Keyword:'', Status:''};
        this.employeeService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
                this.stationList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    validatePhoneNumber(){
        var phoneno = /^\d{10}$/;
        var phone=this.supportForm.get('phone').value;
        if(phone.match(phoneno))
        {
            
        }
         else
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect phone number format',
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
               this.supportForm.patchValue({'phone':""});
            });        
        }
    }
    onImageClick(){
        if (this.PAGEMODE=='edit'){
            var form=document.getElementById('uploader');
            var photo=document.getElementById('photo');
            photo.style.display='none';
            form.style.display='block';
        }
    }
    onIdentityImageClick(){
        if (this.PAGEMODE=='edit'){
            var form=document.getElementById('identity');
            var photo=document.getElementById('identityPhoto');
            photo.style.display='none';
            form.style.display='block';
        }
    }
    onLicenseImageClick(){
        if (this.PAGEMODE=='edit'){
            var form=document.getElementById('license');
            var photo=document.getElementById('licensePhoto');
            photo.style.display='none';
            form.style.display='block';
        }
    }

    onUploadSuccess(): void {
        const confirmation = this._fuseAlertnService.open({
            title  : 'Success',
            message: 'Upload image successfully',
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
    }
  
}
