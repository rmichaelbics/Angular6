import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidatior } from 'src/app/Custom/custom.validators';

import { ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import { EmployeeService } from '../employee.services';
import { IEmployee} from '../IEmployee';
import { ISkill} from '../ISkill';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: IEmployee;

  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 10 characters.'
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email should be dell.com'
    },
    confirmEmail: {
      required: 'Confirm Email is required'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email do not match'
    },
    phone: {
      required: 'Phone is required.'
    }
  };

  formErrors = {
  };

  pageTitle: string;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private empService: EmployeeService,
              private router: Router) { }
  ngOnInit() {

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.email, Validators.required, CustomValidatior.emailDomain('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, {validators: emailMatch}),
      skills: this.fb.array([
         this.addSkillFormGroup()
      ]),
      phone: [''],
      contactpreference: ['email']
    });

    this.employeeForm.get('contactpreference').valueChanges.subscribe((data: string) => {
      console.log(data);
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors();
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      const empId = + params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          email: '',
          phone: null,
          contactPreference: '',
          skills: []
        };
      }
    });
  }

  getEmployee(empId: number) {
    this.empService.getEmployeeById(empId)
    .subscribe(
      (employee: IEmployee) => {
        this.employee = employee;

        this.editEmployee(employee);
      },
      (err: any) => console.log(err));
  }

  mapFormValuesToEmployeeModel() {
    console.log(this.employeeForm.value.email + '  ' + this.employeeForm.value.contactpreference);
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.contactPreference = this.employeeForm.value.contactpreference;
    this.employee.skills = this.employeeForm.value.skills;
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSet: ISkill[]): FormArray {
    console.log(skillSet);
    const formArray = new FormArray([]);
    skillSet.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experience:  s.experience,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }
  onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    const formArray = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('Id', Validators.required),
      new FormControl('Mark', Validators.required),
    ]);
    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('Id', Validators.required),
      new FormControl('Mark', Validators.required),
    ]);

    console.log(formGroup);
    console.log(formArray);

    for (const controls of formArray.controls) {
      if (controls instanceof FormGroup) {
          console.log('Control is a Form Group');
      }
      if (controls instanceof FormControl) {
        console.log('Control is a From Control');
      }
      if ( controls instanceof FormArray) {
        console.log('Control is a form Array');
      }
    }
  }
  removeSkillButtonClick(id: number): void {
    const skillForm = (this.employeeForm.get('skills') as FormArray);
    skillForm.removeAt(id);
    skillForm.markAsDirty();
    skillForm.markAsTouched();
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = + params.get('id');
      if (id) {
        this.empService.updateEmployee(this.employee, id).subscribe(
          () => this.router.navigate(['list']),
          (err: any) => console.log(err)
        );
      } else {
        this.empService.addEmployee(this.employee).subscribe(
          () => this.router.navigate(['list']),
          (err: any) => console.log(err)
        );
      }
    });
  }
  addSkillFormGroup(): FormGroup {
     return this.fb.group({
      skillName: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      proficiency: ['', [Validators.required]]
    });
  }
  addSkillButtonClick(): void {
      (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((Keys: string) => {
      const abstractControl = group.get(Keys);

      this.formErrors[Keys] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.dirty || abstractControl.touched || abstractControl.value !== '')) {
        const messages = this.validationMessages[Keys];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[Keys] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
}

function emailMatch(group: AbstractControl): {[key: string]: any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if ( emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
      return null;
  } else {
      return {['emailMismatch']: true };
  }
}



