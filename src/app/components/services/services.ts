import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface ServiceItem {
  key: string;
  icon: 'shipping' | 'locker' | 'cargo';
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  services: ServiceItem[] = [
    { key: 'shipping', icon: 'shipping' },
    { key: 'locker', icon: 'locker' },
    { key: 'cargo', icon: 'cargo' }
  ];
}
