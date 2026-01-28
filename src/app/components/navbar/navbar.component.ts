import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [TranslatePipe, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    private translationService = inject(TranslationService);
    authService = inject(AuthService);
    private router = inject(Router);

    currentLang = this.translationService.currentLang;
    isLangMenuOpen = signal(false);

    toggleLangMenu() {
        this.isLangMenuOpen.update((v) => !v);
    }

    setLang(lang: 'Español' | 'English') {
        this.translationService.setLanguage(lang);
        this.isLangMenuOpen.set(false);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
