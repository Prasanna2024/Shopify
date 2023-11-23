import { Component, EventEmitter, Output } from '@angular/core';
import { StoreService } from '../services/store.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  filterCategory: any = [];
  toppings = new FormControl('');
  productData: any[] = [];
  @Output() toppingsChange = new EventEmitter<string>();
  constructor(private _services: StoreService) {
    this._services._ProductData$.subscribe({
      next: (data) => {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        console.log(uniqueCategories);
        this.filterCategory = uniqueCategories;
      }
    });
    this._services._ProductData$.subscribe({
      next: (data) => {
        this.productData = data;
      }
    })
  }
  changefilter() {
    console.log(this.toppings['value']);
    this.toppingsChange.emit(this.toppings['value'])
  }
  changefilternew(d:string)
  {
    // this.toppings['value'].length==0;
    this.toppings.setValue(d);
    this.changefilter()
  }
}
