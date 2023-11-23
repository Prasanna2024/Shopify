import { Component } from '@angular/core';
import { PincodeComponent } from './pincode/pincode.component';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from '../services/store.service';

export interface DialogData {
  pincode: number
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {
  pincode: number;
  productData: any = [];
  cartData: any = [];
  totalPrice: number = 0;
  constructor(public dialog: MatDialog, private _services: StoreService) {
    this._services._cartData$.subscribe({
      next: (data) => {
        this.cartData = data.filter((data)=>data['ordercount']>=1);
        // this.cartData = data
        data.filter((dt) => this.totalPrice = (this.totalPrice + dt['price']) * dt['ordercount'])
      }
    });

    this._services._ProductData$.subscribe({
      next: (data) => {
        this.productData = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PincodeComponent, {
      data: { pincode: this.pincode },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.pincode = result;
    });
  }
  deleteFaviorate(productId: number) {
    this.cartData = this._services.deleteCart(productId);
    this.getTotal();
  }
  saveforLater(productId: number) {
    const updatedProducts = this.productData.map((product) =>
      product.id === productId ? { ...product, faviorate: true } : product
    );
    const updateCart = this.cartData.filter((data) => data['id'] != productId);
    this.cartData = updateCart;
    this._services.updateCart(productId);
    this._services.updateProduct(updatedProducts);
    this._services.updateCartData(this.cartData);
    // console.log(this.cartData);
  }

  payTotalCart() {
    console.log(this.productData);
    console.log(this.cartData);
    this.cartData = this.cartData.map((data) => {
      return {
        ...data,          // Spread the existing properties of data
        stock: data.stock - data['ordercount'],     // Reset ordercount to 0
        orderdone: data.orderdone + data['ordercount'],
        faviorate:false,
        ordercount: 0 ,
      };
    });
    const filteredProductData = this.productData.filter(data => !this.cartData.map(cartItem => cartItem.id).includes(data.id));
    console.log(filteredProductData);
    this._services.updateProduct([...this.cartData, ...filteredProductData])
    this._services.updateCartData(this.cartData);
    this._services.clearCartSize();

  }
  getTotal() {
    this.totalPrice = 0;
    this.cartData.filter((data)=>this.totalPrice += data['price']*data['ordercount'])
  }
}


