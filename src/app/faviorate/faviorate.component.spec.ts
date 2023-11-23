import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaviorateComponent } from './faviorate.component';

describe('FaviorateComponent', () => {
  let component: FaviorateComponent;
  let fixture: ComponentFixture<FaviorateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaviorateComponent]
    });
    fixture = TestBed.createComponent(FaviorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
