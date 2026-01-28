import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
    selector: 'app-customer-notifications',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './customer-notifications.html',
})
export class CustomerNotifications {
    notifications = signal([
        {
            id: 1,
            title: 'Paquete recibido en Miami',
            message: 'Tu paquete con tracking 1Z999AA10123456784 ha sido recibido en nuestra bodega de Miami.',
            date: new Date(),
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'Paquete en tránsito',
            message: 'Tu paquete 1Z999AA10123456784 ya va rumbo a tu país.',
            date: new Date(Date.now() - 86400000), // Yesterday
            read: true,
            type: 'success'
        }
    ]);

    markAsRead(id: number) {
        this.notifications.update(notes =>
            notes.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }
}
