import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ServiceItem } from '../../interfaces/service.interface';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-services-grid',
    imports: [TranslatePipe],
    templateUrl: './services-grid.component.html',
    styleUrl: './services-grid.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesGridComponent {
    private translationService = inject(TranslationService);

    services = computed<ServiceItem[]>(() => {
        // Force recomputation when language changes
        this.translationService.getLangCode();

        return [
            {
                id: 'shipping',
                title: this.translationService.translate('services.shipping.title'),
                description: this.translationService.translate('services.shipping.description'),
                iconName: 'global',
            },
            {
                id: 'cargo',
                title: this.translationService.translate('services.cargo.title'),
                description: this.translationService.translate('services.cargo.description'),
                iconName: 'crane',
            },
            {
                id: 'locker',
                title: this.translationService.translate('services.locker.title'),
                description: this.translationService.translate('services.locker.description'),
                iconName: 'bag',
            },
        ];
    });
}
