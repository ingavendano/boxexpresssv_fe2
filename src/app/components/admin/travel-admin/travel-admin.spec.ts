import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAdmin } from './travel-admin';

describe('TravelAdmin', () => {
  let component: TravelAdmin;
  let fixture: ComponentFixture<TravelAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
