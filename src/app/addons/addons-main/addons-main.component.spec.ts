import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsMainComponent } from './addons-main.component';

describe('AddonsMainComponent', () => {
  let component: AddonsMainComponent;
  let fixture: ComponentFixture<AddonsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonsMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
