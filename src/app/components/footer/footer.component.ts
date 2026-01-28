import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-footer',
    imports: [TranslatePipe],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent { }
