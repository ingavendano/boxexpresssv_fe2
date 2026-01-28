import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAdmin } from './tracking-admin';

describe('TrackingAdmin', () => {
  let component: TrackingAdmin;
  let fixture: ComponentFixture<TrackingAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
