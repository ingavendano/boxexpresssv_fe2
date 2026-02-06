import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TariffService, TariffCategory, TariffRange } from '../../../services/tariff/tariff.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-public-quote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './public-quote.component.html'
})
export class PublicQuoteComponent {
  private tariffService = inject(TariffService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  quoteForm: FormGroup;

  // Data
  tariffCategories = signal<TariffCategory[]>([]);
  availableSubcategories = signal<TariffRange[]>([]);

  // Result
  quoteResult = signal<any>(null);
  isLoading = signal(false);

  constructor() {
    this.quoteForm = this.fb.group({
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      weight: [1, [Validators.required, Validators.min(0.1)]],
      declaredValue: [0, [Validators.required, Validators.min(0)]],
      isHomeDelivery: [false]
    });

    // Subcategory logic
    this.quoteForm.get('category')?.valueChanges.subscribe(catId => {
      if (catId) {
        const category = this.tariffCategories().find(c => c.id == catId);
        if (category) {
          this.availableSubcategories.set(category.ranges || []);
          this.quoteForm.patchValue({ subcategory: '' });
        }
      }
    });

    this.loadTariffs();
  }

  loadTariffs() {
    // Note: This relies on existing TariffService which allows public access to categories?
    // If not, we might need a public endpoint for categories too. 
    // Assuming categories are public or we use the cached one if auth fails?
    // Actually, usually tariff configs are public. Let's try.
    this.tariffService.getAllCategories().subscribe({
      next: (cats) => this.tariffCategories.set(cats),
      error: (err) => console.error('Error loading tariffs', err)
    });
  }

  calculate() {
    if (this.quoteForm.invalid) return;

    this.isLoading.set(true);
    const formVal = this.quoteForm.value;

    const request = {
      weight: formVal.weight,
      declaredValue: formVal.declaredValue,
      subcategoryId: formVal.subcategory,
      isHomeDelivery: formVal.isHomeDelivery
    };

    this.http.post(`${environment.apiUrl}/api/public/quote`, request).subscribe({
      next: (res: any) => {
        this.quoteResult.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error calculating quote', err);
        this.isLoading.set(false);
      }
    });
  }
}
