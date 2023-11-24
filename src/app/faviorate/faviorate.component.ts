import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
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
    const productfromSession = JSON.parse(sessionStorage.getItem('products'))
    if (productfromSession) {
      this.ProductData = productfromSession
      this.updateFaviorate();
      this.getTotalPrice();
    }
    else {
      this._service._ProductData$.subscribe({
        next: (dta) => {
          this.ProductData = dta.map((data) => data['ordercount'] > 0 && data['faviorate'] == true);
        }
      })
      this.updateFaviorate()
      this.getTotalPrice()
    }
  }
  ngOnInit() {

  }
  updateFaviorate() {
    this.FaviorateData = this.ProductData.filter((data) => data['faviorate'] == true);
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
    this.updateFaviorate();

  }
  getTotalPrice() {
    this.totalPrice = 0;
    this.FaviorateData.filter((dta) => {
      this.totalPrice += dta['price'] * dta['ordercount'];
    })

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
      this._service.updateProduct(this.ProductData);
      this.updateFaviorate();
      this.getTotalPrice();
    }
    else alert("Cart should be atleast with one quantity");
  }

}
