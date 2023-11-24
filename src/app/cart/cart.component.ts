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
    const storedCart = sessionStorage.getItem('cartData');
    const storedProducts = sessionStorage.getItem('products');
    if (storedProducts) {
      this.cartData = (JSON.parse(storedCart));
      this.productData = (JSON.parse(storedProducts));
      this.getTotal();

    }
    else {
      this._services._cartData$.subscribe({
        next: (data) => {
          this.cartData = data;
          this.getTotal();
        }
      });
      this.getTotal();
      this._services._ProductData$.subscribe({
        next: (data) => {
          this.productData = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
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
    const orderchange = this.cartData.find(obj=>obj['id']==productId).ordercount
    const updatedProducts = this.productData.map((product) =>
      product.id === productId ? { ...product, faviorate: true,ordercount:orderchange } : product
    );
    console.log("------------------<cartData>-----------");
    console.log(updatedProducts);
    console.log("------------------<cartData>-----------");
    const updateCart = this.cartData.filter((data) => data['id'] != productId);
    this.cartData = updateCart;
    sessionStorage.setItem('cartData',this.cartData);
    this._services.updateCart(productId);
    this._services.changeCarts(this.cartData);
    this._services.updateProduct(updatedProducts);
    this.getTotal();
  }

  payTotalCart() {
    const check = this.cartData.filter((data)=>data['ordercount']>data['stock'] || data['ordercount']<=0)
    if(check.length==0)
    {
    this.cartData = this.cartData.map((data) => {
      return {
        ...data,          // Spread the existing properties of data
        stock: data.stock - data['ordercount'],     // Reset ordercount to 0
        orderdone: data.orderdone + data['ordercount'],
        faviorate: false,
        ordercount: 0,
      };
    });

    const filteredProductData = this.productData.filter(data => !this.cartData.map(cartItem => cartItem.id).includes(data.id));
    console.log(filteredProductData);
    this._services.updateProduct([...this.cartData, ...filteredProductData])
    const emp: any = []
    sessionStorage.setItem('cartData', emp);
    this.cartData = [];
    this._services.updateCartData();
    this.getTotal();
  }
  else 
  {
    confirm("You have choosen a order greater than  or you cannot pay for zero stock!")
  }

  }
  getTotal() {
    this.totalPrice = 0;
    this.cartData.filter((data) => this.totalPrice += data['price'] * data['ordercount'])
  }
}


