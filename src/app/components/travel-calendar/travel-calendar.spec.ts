import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCalendar } from './travel-calendar';

describe('TravelCalendar', () => {
  let component: TravelCalendar;
  let fixture: ComponentFixture<TravelCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
