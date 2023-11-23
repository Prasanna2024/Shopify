import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartComponent, DialogData } from '../cart.component';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss']
})
export class PincodeComponent {
  constructor(
    public dialogRef: MatDialogRef<PincodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
