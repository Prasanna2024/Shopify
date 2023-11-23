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
  constructor(private route: ActivatedRoute, private _service: StoreService, private routes: Router) {
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' should match the parameter name in your route configuration
      this.currentId = id;
      // console.log('ID from route:', id);
    });
    this._service._ProductData$.subscribe({
      next: (data) => {
        // console.log(this.currentId);
        this.CurrentProduct = data.filter((dta: any) => dta['id'] == this.currentId)[0]
        // console.log(this.CurrentProduct);
      }
    })
  }
  addCart() {

    const yes = confirm("Do you want to add it with cart?")
    if (yes) {
      this._service.updateFromView(this.currentId);
      this.CurrentProduct['ordercount'] = 1;
      this._service.updateCart(this.CurrentProduct);
      this.routes.navigate(['/cart']);
    }
  


  }

}
