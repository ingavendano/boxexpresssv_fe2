import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TravelService, Travel } from '../../services/travel.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-travel-calendar',
  standalone: true,
  imports: [CommonModule, TranslatePipe, DatePipe],
  templateUrl: './travel-calendar.html',
  styleUrl: './travel-calendar.css'
})
export class TravelCalendarComponent implements OnInit {
  private travelService = inject(TravelService);

  travels = signal<Travel[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.travelService.getPublicTravels().subscribe({
      next: (data) => {
        this.travels.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching travels', err);
        this.isLoading.set(false);
      }
    });
  }

  isClosingSoon(dateString: string): boolean {
    const closingDate = new Date(dateString);
    const now = new Date();
    const diffInMs = closingDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 48;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTransportIcon(type: string): string {
    switch (type) {
      case 'AIR': return 'plane';
      case 'SEA': return 'ship';
      case 'GROUND': return 'truck';
      default: return 'box';
    }
  }
}
