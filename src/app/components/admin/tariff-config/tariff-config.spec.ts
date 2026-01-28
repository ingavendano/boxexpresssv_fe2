import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffConfig } from './tariff-config';

describe('TariffConfig', () => {
  let component: TariffConfig;
  let fixture: ComponentFixture<TariffConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TariffConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
