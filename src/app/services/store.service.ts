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
  private _cartSize = new BehaviorSubject<any>([]);
  public _cartSize$ = this._cartSize.asObservable();

  constructor(private _http: HttpClient) {
    this.getProductData().subscribe({
      next: (dta: any) => {
        const dt = dta.products;
        const upData = dt.map((obj: any) => {
          obj['faviorate'] = false;
          obj['ordercount'] = 0;
          obj['orderdone']=0
          return obj;
        });
        this._ProductsData.next(upData)
        this.saveitSession(this._ProductsData.value);
        // console.log(dta, this._ProductData$);
      },
      error: (err) => {
        console.log(err);
      }
    })
    console.log(this._ProductData$);
  }

  saveitSession(products:any)
  {
    sessionStorage.setItem('products',products);
  }
  authCheck(email: string, password: string) {
    return this._http.post('http://127.0.0.1:8000/loginset/loginset/', {
      email,
      password,
    });
  }
  getProductData(): Observable<any> {
    return this._http.get('https://dummyjson.com/products');
  }

  updateProduct(updatedData: any) {
    this._ProductsData.next(updatedData);
    this._cartData.next(this.getCartDatas())
    console.log(this._ProductsData.value);
  }
  addCart(id: number) {
    this._CartIds.value.push(id);
    const setIds = Array.from(new Set(this._CartIds.value));
    // console.log(setIds);
  }
  clearCartSize()
  {
    this._cartSize.next(0);
    this._cartData.next([]);
    console.log("9909090909090909")
  }
  getCartDatas() 
  {
    const cart = this._ProductsData.value.filter((obj) => this._CartIds.value.includes(obj.id));
    this._cartData.next(cart);
    this._cartSize.next(this._cartData.value.length)
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
          data['orderdone']=0
        return data
      }
      return data
    })
    this._ProductsData.next(update);
    this._cartData.next(this.getCartDatas())
    return this._cartData.value
  }
  updateCart(id: number) {
    // console.log("%%%%%%%%%%%")
    // console.log(this._CartIds.value);
    const d = this._CartIds.value.filter((data) => data != id);
    this._CartIds.next(d);
    this.getCartDatas();
    // console.log(this._CartIds.value);
    // console.log("%%%%%%%%%%%")

  }
  updateFromView(id:number)
  {
    const d = this._CartIds.value;
    // console.log(d);
    d.push(Number(id));
    // this.updateCart(id);
    this._CartIds.next(d);
    // console.log(this._CartIds.value);
    const d1 = this._ProductsData.value.filter((data)=>this._cartData.value.includes(data['id']));
    // console.log(d1);
    const cd = this._cartData.value;
    cd.push(d1)
    this._cartData.next(cd);
    console.log(this._cartData.value);
  }
  updateCartData(data:any)
  {
    this._cartData.next(data);
  }

}
