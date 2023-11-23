import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { filter } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faviorate',
  templateUrl: './faviorate.component.html',
  styleUrls: ['./faviorate.component.scss']
})
export class FaviorateComponent implements OnInit {
  ProductData: any = []
  FaviorateData: any = [];
  totalPrice: number = 0;
  constructor(private _service: StoreService, private router: Router) {
    this._service._ProductData$.subscribe({
      next: (dta) => {
        this.ProductData = dta;
        this.FaviorateData = dta.filter((data) => data['faviorate'] == true);
        // console.log(this.FaviorateData);
      }
    })
    this.getTotalPrice()
  }
  ngOnInit() {

  }
  deleteFaviorate(productId: number) {
    this.FaviorateData = this.FaviorateData.map((product) =>
      product.id === productId ? { ...product, faviorate: false, ordercount: 0 } : product
    );
    this.ProductData = this.ProductData.map((product) =>
      product.id === productId ? { ...product, faviorate: false, ordercount: 0 } : product
    );
    this.getTotalPrice();
    if (this.FaviorateData.length === 0) this.totalPrice = 0;
    this._service.updateProduct(this.ProductData);
  }
  getTotalPrice() {
    this.totalPrice = 0;
    this.FaviorateData.filter((dta) => {
      this.totalPrice += dta['price'] * dta['ordercount'];
      // console.log(dta['ordercount']);
    }

    )
    // console.log(this.totalPrice);
  }
  addCount(id: number) {
    this.FaviorateData = this.FaviorateData.map((product) =>
      product.id == id ? { ...product, ordercount: product.ordercount + 1 } : product)
    this.getTotalPrice();
  }
  removeCount(id: number) {
    this.FaviorateData = this.FaviorateData.map((product) =>
      product.id == id ? { ...product, ordercount: product.ordercount - 1 } : product)
    this.getTotalPrice()
  }
  gotoCart(id: number, ordercount: number) {
    if (ordercount >= 1) {
      this._service.addCart(id);
      this.ProductData.map((data) => {
        if (data['id'] === id) { data['faviorate'] = false }
      })
      // console.log(this.ProductData);
      this._service.updateProduct(this.ProductData);
      this.getTotalPrice();
      this._service.updateProduct(this.ProductData);
    }
    else alert("Cart should be atleast with one quantity");
  }

}
