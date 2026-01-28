import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { es } from '../translations/es';
import { en } from '../translations/en';

type Language = 'es' | 'en';
type TranslationKey = string;

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private platformId = inject(PLATFORM_ID);
    private translations = { es, en };
    private currentLangCode = signal<Language>('es'); // Default to Spanish

    // Public computed signal for current language display name
    currentLang = computed(() => {
        return this.currentLangCode() === 'es' ? 'Español' : 'English';
    });

    constructor() {
        // Load saved language from localStorage or use browser language
        this.initializeLanguage();
    }

    private initializeLanguage(): void {
        // Only access localStorage in browser environment
        if (isPlatformBrowser(this.platformId)) {
            const savedLang = localStorage.getItem('preferred-language') as Language;
            if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
                this.currentLangCode.set(savedLang);
            } else {
                // Detect browser language
                const browserLang = navigator.language.toLowerCase();
                const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
                this.currentLangCode.set(detectedLang);
            }
        }
        // If running on server, keep default language (Spanish)
    }

    setLanguage(lang: 'Español' | 'English'): void {
        const langCode: Language = lang === 'Español' ? 'es' : 'en';
        this.currentLangCode.set(langCode);

        // Only save to localStorage in browser environment
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('preferred-language', langCode);
        }
    }

    translate(key: TranslationKey): string {
        const keys = key.split('.');
        let value: any = this.translations[this.currentLangCode()];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    }

    // Method to get current language code for reactive updates
    getLangCode = computed(() => this.currentLangCode());
}
