import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingService, PackagePublic } from '../../services/tracking.service';
import { TrackingStatusService } from '../../services/tracking-status.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe, DatePipe],
    templateUrl: './tracking.component.html',
    styleUrl: './tracking.component.css'
})
export class TrackingComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private trackingService = inject(TrackingService);
    private trackingStatusService = inject(TrackingStatusService);

    trackingId = signal('');
    packageData = signal<PackagePublic | null>(null);
    isLoading = signal(false);
    error = signal<string | null>(null);
    linkCopied = signal(false);
    activeStatuses = signal<any[]>([]);

    steps = computed(() => {
        // Map active statuses to steps, maybe filter or map icons if needed
        // For now, simple mapping. If icons are needed, we might need a map or status property.
        const defaultIcons: any = {
            'RECEIVED': 'warehouse',
            'IN_TRANSIT': 'plane',
            'IN_CUSTOMS': 'building',
            'READY_PICKUP': 'check',
            'DELIVERED': 'package'
        };

        return this.activeStatuses().map(s => ({
            status: s.code,
            label: s.code,
            name: s.name,
            icon: defaultIcons[s.code] || 'circle' // Fallback icon
        }));
    });

    ngOnInit() {
        this.loadStatuses();

        this.route.queryParams.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.trackingId.set(id);
                this.search();
            }
        });
    }

    loadStatuses() {
        this.trackingStatusService.getActiveStatuses().subscribe({
            next: (data) => this.activeStatuses.set(data),
            error: (err) => console.error('Error loading statuses', err)
        });
    }

    search() {
        if (!this.trackingId().trim()) return;

        this.isLoading.set(true);
        this.error.set(null);
        this.packageData.set(null);

        // Update URL without reloading
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: this.trackingId() },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });

        this.trackingService.trackPackage(this.trackingId()).subscribe({
            next: (data) => {
                this.packageData.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.isLoading.set(false); // Stop loading
                if (err.status === 404) {
                    this.error.set('tracking.notFound');
                } else {
                    this.error.set('tracking.error');
                }
            }
        });
    }

    isStepCompleted(stepStatus: string): boolean {
        const current = this.packageData()?.currentStatus;
        if (!current) return false;

        // If current is DELIVERED, all previous are completed
        // Compare sortOrder
        const currentStatusObj = this.activeStatuses().find(s => s.code === current.code);
        const stepStatusObj = this.activeStatuses().find(s => s.code === stepStatus);

        if (!currentStatusObj || !stepStatusObj) return false;

        return currentStatusObj.sortOrder >= stepStatusObj.sortOrder;
    }

    isActiveStep(stepStatus: string): boolean {
        return this.packageData()?.currentStatus.code === stepStatus;
    }

    copyLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            this.linkCopied.set(true);
            setTimeout(() => this.linkCopied.set(false), 2000);
        });
    }

    openWhatsApp() {
        const message = `Hola Box Express, tengo una duda con mi paquete ${this.trackingId()}`;
        window.open(`https://wa.me/50326068202?text=${encodeURIComponent(message)}`, '_blank');
    }
}
