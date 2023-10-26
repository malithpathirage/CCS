import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-user-pwchange',
  templateUrl: './user-pwchange.component.html',
  styleUrls: ['./user-pwchange.component.css'],
})
export class UserPwchangeComponent implements OnInit {
  pwChangeForm: FormGroup;
  validationErrors: string[] = [];
  member: Member;
  user: User;
  pwdSaveButton: boolean = false;

  constructor(
    private registerService: RegisterService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 91).length > 0) {
        this.pwdSaveButton = true;
      }
    }

    this.pwChangeForm = this.fb.group({
      cAgentName: ['', Validators.required],
      OldPassword: [],
      cPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('cPassword')],
      ],
    });
    this.pwChangeForm.controls.cPassword.valueChanges.subscribe(() => {
      this.pwChangeForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  /// CHECK THE PASSWORD MATCH BY THE CONFIRM PASSWORD
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  changeUserPassword() {
    if(this.pwdSaveButton == true) {
    var userName = this.pwChangeForm.get('cAgentName').value;
    this.member = Object.assign({}, this.pwChangeForm.value);
    // this.registerService.changeUserPassword(userName, this.member).subscribe(
    //   () => {
    //     this.toastr.success('Password changed Successfully !!!');
    //     this.pwChangeForm.reset();
    //   },
    //   (error) => {
    //     this.validationErrors = error;
    //   });
    // } else {
    //   this.toastr.error('Save permission denied !!!');
     }
  }

  searchUserPassword() {
    var userName = this.pwChangeForm.get('cAgentName').value;
    this.pwChangeForm.get('OldPassword').setValue('');
    this.registerService.getUserByName(userName).subscribe(
      (member) => {
        // console.log(member["cPassword"]);
        this.pwChangeForm.get('OldPassword').setValue(member['cPassword']);
      },
      (error) => {
        //console.log(error);
        this.validationErrors = error;
      }
    );
  }

  resetForm() {
    this.pwChangeForm.reset();
  }

  clearPassword(event: any) {
    this.pwChangeForm.get('OldPassword').setValue('');
  }
}
