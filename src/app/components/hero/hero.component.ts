import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Router } from '@angular/router';

@Component({
    selector: 'app-hero',
    imports: [FormsModule, TranslatePipe],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
    private router = inject(Router);
    searchQuery = signal('');

    onSearch() {
        if (this.searchQuery().trim()) {
            this.router.navigate(['/tracking'], { queryParams: { id: this.searchQuery().trim() } });
        }
    }
}
