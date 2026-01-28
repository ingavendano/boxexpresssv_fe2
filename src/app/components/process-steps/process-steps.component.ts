import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-process-steps',
    imports: [TranslatePipe],
    templateUrl: './process-steps.component.html',
    styleUrl: './process-steps.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessStepsComponent {
    private translationService = inject(TranslationService);

    steps = computed(() => {
        // Force recomputation when language changes
        this.translationService.getLangCode();

        return [
            {
                id: 1,
                number: '01',
                title: this.translationService.translate('processSteps.step1.title'),
                description: this.translationService.translate('processSteps.step1.description'),
                icon: 'inbox'
            },
            {
                id: 2,
                number: '02',
                title: this.translationService.translate('processSteps.step2.title'),
                description: this.translationService.translate('processSteps.step2.description'),
                icon: 'plane'
            },
            {
                id: 3,
                number: '03',
                title: this.translationService.translate('processSteps.step3.title'),
                description: this.translationService.translate('processSteps.step3.description'),
                icon: 'check'
            }
        ];
    });
}
