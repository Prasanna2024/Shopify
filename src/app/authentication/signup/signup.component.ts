import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  constructor(private _service: StoreService, private router: Router, private _snackBar: MatSnackBar) { }
  signupForm: FormGroup;
  ngOnInit() {
    this.signupForm = new FormGroup({
      firstname: new FormControl("", Validators.required),
      lastname: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      confirmpassword: new FormControl("", Validators.required)
    })

  }
  signupSubmit() {
    const data = this.signupForm.value;
    if (this.signupForm.valid) {
      this._service.authCheck(data.email, data.password);
      // console.log(data);
      this.signupForm.reset();
      this.router.navigate(['/'])
    } else {
      this._snackBar.open("emial not found ", "clear");
    }
  }
}

