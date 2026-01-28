import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy, EffectRef, effect } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'translate',
    pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    private translationService = inject(TranslationService);
    private cdr = inject(ChangeDetectorRef);
    private effectRef: EffectRef;

    constructor() {
        // Create an effect to trigger change detection when language changes
        this.effectRef = effect(() => {
            // Access the language code to create a dependency
            this.translationService.getLangCode();
            // Trigger change detection
            this.cdr.markForCheck();
        });
    }

    transform(key: string): string {
        return this.translationService.translate(key);
    }

    ngOnDestroy(): void {
        this.effectRef.destroy();
    }
}
