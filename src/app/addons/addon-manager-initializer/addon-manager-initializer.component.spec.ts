import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonManagerInitializerComponent } from './addon-manager-initializer.component';

describe('AddonManagerInitializerComponent', () => {
  let component: AddonManagerInitializerComponent;
  let fixture: ComponentFixture<AddonManagerInitializerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonManagerInitializerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonManagerInitializerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
