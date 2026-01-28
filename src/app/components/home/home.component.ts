import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { ServicesGridComponent } from '../services-grid/services-grid.component';
import { ProcessStepsComponent } from '../process-steps/process-steps.component';
import { PricingTableComponent } from '../pricing-table/pricing-table.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HeroComponent,
        ServicesGridComponent,
        ProcessStepsComponent,
        PricingTableComponent,
    ],
    template: `
    <app-hero />
    <app-services-grid />
    <app-process-steps />
    <app-pricing-table />
  `,
})
export class HomeComponent { }
