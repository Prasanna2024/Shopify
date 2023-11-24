import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-viewcard',
  templateUrl: './viewcard.component.html',
  styleUrls: ['./viewcard.component.scss']
})
export class ViewcardComponent implements OnInit {
  CurrentProduct: any = [];
  currentId: number;
  currentSlide: number = 0; // Added variable for image slider
  cartdata: any = [];
  productData:any = [];
  constructor(private route: ActivatedRoute, private _service: StoreService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.currentId = id;
    });

    this._service._ProductData$.subscribe({
      next: (data) => {
        this.productData = data;
        this.CurrentProduct = data.filter((dta: any) => dta['id'] == this.currentId)[0];
      }
    });
    this._service._cartData$.subscribe({
      next: (data) => {
        this.cartdata = data;
      }
    })
  }
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.CurrentProduct.images.length) % this.CurrentProduct.images.length;
  }
  changeSlide(id: number) {
    this.currentSlide = id;
  }
  addCart() {
    const yes = confirm("Do you want to add it to the cart?");
    if (yes) {
      this._service.updateFromView(this.currentId);
      this.CurrentProduct['ordercount'] = 1;
      this._service.updateCart(this.CurrentProduct);
      this.router.navigate(['/cart']);
    }
  }

  // Function to handle the image slider
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.CurrentProduct.images.length;
  }
  check() {
    console.log("===========================================");
  }
  faviorateSubmit() {
    var yes;
    if (this.CurrentProduct['faviorate'] == false) {
      yes = confirm(`do you want to add  i${this.CurrentProduct['title']}n favorite list!!!`)
    }
    else {
      yes = confirm(`do you want to remove ${this.CurrentProduct['title']} from fav list`)
    }
    if (yes) {
      this.CurrentProduct['faviorate'] = !this.CurrentProduct['faviorate'];
      this.productData.map((data)=>data['id']!=this.currentId)
      console.log(this.productData);
      this._service.updateProduct([...this.productData,this.CurrentProduct])
    }
  }
  changeSlides(id: number): void {
    this.currentSlide = id;
  }
  
}
