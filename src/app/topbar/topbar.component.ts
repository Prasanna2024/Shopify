import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  cartSize:any[] = [];
  constructor(private router: Router,private _service:StoreService)
  {
    this._service._cartData$.subscribe({
      next:(data)=>
      {
        this.cartSize = data
      }
    });
    console.log(this.cartSize); 
  }
  serachText:string="";
  inputChange(){
    // console.log(this.serachText);
  }
  
}
