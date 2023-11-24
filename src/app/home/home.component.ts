import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ProductsData: any = []
  ProductsDataChange: any = []
  filtersData: string;
  ngOnInit() {
    this._service._ProductData$.subscribe({
      next: (dta) => {
        this.ProductsDataChange = dta
        this.ProductsData = this.ProductsDataChange
        console.log(this.ProductsData);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  constructor(private _service: StoreService, private route: Router) {

  }

  get() {
    // console.log(this.ProductsData);
  }
  faviorateSubmit(indx: number) {
    var yes;
    if(this.ProductsData[indx]['faviorate']==false){
    yes = confirm(`do you want to add  i${this.ProductsData[indx]['title']}n favorite list!!!`)
    }
    else 
    {
      yes = confirm(`do you want to remove ${this.ProductsData[indx]['title']} from fav list`)
    }
    if(yes)
    {
      this.ProductsData[indx]['faviorate'] = !this.ProductsData[indx]['faviorate'];
      this._service.updateProduct(this.ProductsData)
    }
    // console.log(this.ProductsData[indx]['faviorate']);
    // this._service.updateProduct(this.ProductsData);
  }
  routerToProduct(id: any) {
    this.route.navigate(['home/', id]);
  }
  handleToppingsChange(selectedToppings: any) {
    this.filtersData = selectedToppings;
    console.log();
    this.makeFilter()
    // Do whatever you need with the selected toppings
  }
  makeFilter() {
    const data = this.ProductsData;
    this.ProductsData = this.ProductsDataChange;
    const filterdData = this.ProductsData.filter((data) => data['category']===this.filtersData);
    this.ProductsData = filterdData;
    console.log(filterdData);

    // data['category'])
  }
}
