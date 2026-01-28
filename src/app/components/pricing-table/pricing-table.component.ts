import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { PricingPlan } from '../../interfaces/pricing.interface';
import { CurrencyPipe } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-pricing-table',
    imports: [CurrencyPipe, TranslatePipe],
    templateUrl: './pricing-table.component.html',
    styleUrl: './pricing-table.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingTableComponent {
    private translationService = inject(TranslationService);

    plans = computed<PricingPlan[]>(() => {
        // Force recomputation when language changes
        this.translationService.getLangCode();

        return [
            {
                id: 'compact',
                name: this.translationService.translate('pricing.plans.compact.name'),
                subtitle: this.translationService.translate('pricing.plans.compact.subtitle'),
                dimensions: '12" x 12" x 12"',
                price: 45,
                currency: 'USD',
                iconName: 'box-sm'
            },
            {
                id: 'mid',
                name: this.translationService.translate('pricing.plans.mid.name'),
                subtitle: this.translationService.translate('pricing.plans.mid.subtitle'),
                dimensions: '18" x 18" x 18"',
                price: 75,
                currency: 'USD',
                iconName: 'box-md'
            },
            {
                id: 'max',
                name: this.translationService.translate('pricing.plans.max.name'),
                subtitle: this.translationService.translate('pricing.plans.max.subtitle'),
                dimensions: '24" x 24" x 24"',
                price: 120,
                currency: 'USD',
                iconName: 'box-lg'
            }
        ];
    });
}
