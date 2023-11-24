import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StoreService {
  private _ProductsData = new BehaviorSubject<any>([]);
  public _ProductData$ = this._ProductsData.asObservable();
  private _CartIds = new BehaviorSubject<number[]>([]);
  public _CartIds$ = this._CartIds.asObservable();
  private _cartData = new BehaviorSubject<any[]>([]);
  public _cartData$ = this._cartData.asObservable();



  constructor(private _http: HttpClient) {
    const storedProducts = sessionStorage.getItem('products');
    if (storedProducts) {
      this._ProductsData.next(JSON.parse(storedProducts));
    }
    else {
      this.getProductData().subscribe({
        next: (dta: any) => {
          const dt = dta.products;
          const upData = dt.map((obj: any) => {
            obj['faviorate'] = false;
            obj['ordercount'] = 0;
            obj['orderdone'] = 0;
            return obj;
          });
          this._ProductsData.next(upData);
          this.saveitSession(upData);
          sessionStorage.setItem('cartData', JSON.stringify(this._cartData.value));
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  saveitSession(products: any) {
    sessionStorage.setItem('products', JSON.stringify(products));
  }

  authCheck(email: string, password: string) {
    return this._http.post('http://127.0.0.1:8000/loginset/loginset/',
      {
        email,
        password,
      });
  }

  getProductData(): Observable<any> {
    return this._http.get('https://dummyjson.com/products');
  }

  updateProduct(updatedData: any) {
    // Assuming updatedData is an array of products
    const uniqueData = Array.from(new Set(updatedData.map((product: any) => product.id))).map(id => {
      return updatedData.find((product: any) => product.id === id);
    });
  
    uniqueData.sort((a, b) => a.id - b.id); // Sort the data
  
    this._ProductsData.next(uniqueData);
    this._cartData.next(this.getCartDatas());
  
    sessionStorage.setItem('products', JSON.stringify(uniqueData));
    console.log(uniqueData);
  }
  
  addCart(id: number) {
    const ids = this._CartIds.value
    ids.push(id)
    console.log("id-----", ids);
    const setIds = Array.from(new Set(ids));
    this._CartIds.next(setIds);
  }

  clearCartSize() {
    this._cartData.next([]);
    console.log("9909090909090909")
  }

  getCartDatas() {
    const cart = this._ProductsData.value.filter((obj) => this._CartIds.value.includes(obj.id));
    this._cartData.next(cart);
    sessionStorage.setItem('cartData', JSON.stringify(cart));
    return cart;
  }

  deleteCart(productId: number) {
    const d = this._CartIds.value.filter((data) => data != productId);
    this._CartIds.next(d);
    this._cartData.next(this.getCartDatas());
    const update = this._ProductsData.value.map((data) => {
      if (data['id'] == productId) {
        data['faviorate'] = false,
          data['ordercount'] = 0
        data['orderdone'] = 0
        return data
      }
      return data
    })
    this._ProductsData.next(update);
    this._cartData.next(this.getCartDatas())
    return this._cartData.value
  }

  updateCart(id: number) {
    const d = this._CartIds.value.filter((data) => data != id);
    this._CartIds.next(d);
    this.getCartDatas();
  }
 
  changeCarts(data:any)
  {
    this._cartData.next(data);
  }
  updateFromView(id: number) {
    const d = this._CartIds.value;
    d.push(Number(id));
    this._CartIds.next(d);
    const d1 = this._ProductsData.value.filter((data) => this._cartData.value.includes(data['id']));
    const cd = this._cartData.value;
    cd.push(d1)
    this._cartData.next(cd);
    sessionStorage.setItem('cartData', JSON.stringify(cd));
    console.log(this._cartData.value);
  }

  updateCartData() {
    console.log("/------------------------------------/");
    this._cartData.next([]);
    this._CartIds.next([]);
    console.log(this._cartData.value);
    console.log("/------------------------------------/");
    sessionStorage.setItem('cartData', JSON.stringify([]));
  }

}
