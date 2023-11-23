import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcardComponent } from './viewcard.component';

describe('ViewcardComponent', () => {
  let component: ViewcardComponent;
  let fixture: ComponentFixture<ViewcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewcardComponent]
    });
    fixture = TestBed.createComponent(ViewcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
