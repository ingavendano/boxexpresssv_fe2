import { ChangeDetectionStrategy, Component, inject, signal, computed, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface TimelineItem {
  year: string;
  titleKey: string;
  descriptionKey: string;
}

interface PaymentMethod {
  id: string;
  nameKey: string;
  country: 'usa' | 'sv';
  icon: string;
}

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUs implements AfterViewInit {
  private translationService = inject(TranslationService);
  private elementRef = inject(ElementRef);

  // Form state
  formName = signal('');
  formPhone = signal('');
  formPackageType = signal('');
  selectedCountry = signal<'+1' | '+503'>('+503');
  isSubmitting = signal(false);
  formSubmitted = signal(false);

  // Validation states
  nameValid = computed(() => this.formName().length >= 2);
  phoneValid = computed(() => /^\d{8,10}$/.test(this.formPhone()));
  packageTypeValid = computed(() => this.formPackageType().length >= 5);
  formValid = computed(() => this.nameValid() && this.phoneValid() && this.packageTypeValid());

  // Animation states
  historyVisible = signal(false);
  paymentsVisible = signal(false);
  contactVisible = signal(false);

  // Timeline data
  timeline: TimelineItem[] = [
    { year: '2018', titleKey: 'aboutUs.timeline.2018.title', descriptionKey: 'aboutUs.timeline.2018.description' },
    { year: '2020', titleKey: 'aboutUs.timeline.2020.title', descriptionKey: 'aboutUs.timeline.2020.description' },
    { year: '2022', titleKey: 'aboutUs.timeline.2022.title', descriptionKey: 'aboutUs.timeline.2022.description' },
    { year: '2024', titleKey: 'aboutUs.timeline.2024.title', descriptionKey: 'aboutUs.timeline.2024.description' },
  ];

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    { id: 'zelle', nameKey: 'aboutUs.payments.zelle', country: 'usa', icon: 'zelle' },
    { id: 'venmo', nameKey: 'aboutUs.payments.venmo', country: 'usa', icon: 'venmo' },
    { id: 'creditcard', nameKey: 'aboutUs.payments.creditcard', country: 'usa', icon: 'creditcard' },
    { id: 'agricola', nameKey: 'aboutUs.payments.agricola', country: 'sv', icon: 'bank' },
    { id: 'cuscatlan', nameKey: 'aboutUs.payments.cuscatlan', country: 'sv', icon: 'bank' },
    { id: 'cash', nameKey: 'aboutUs.payments.cash', country: 'sv', icon: 'cash' },
  ];

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId === 'history') this.historyVisible.set(true);
          if (sectionId === 'payments') this.paymentsVisible.set(true);
          if (sectionId === 'contact') this.contactVisible.set(true);
        }
      });
    }, options);

    // Observe sections after DOM is ready
    setTimeout(() => {
      const sections = this.elementRef.nativeElement.querySelectorAll('section[id]');
      sections.forEach((section: Element) => observer.observe(section));
    }, 100);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleCountry() {
    this.selectedCountry.set(this.selectedCountry() === '+1' ? '+503' : '+1');
  }

  async submitForm() {
    if (!this.formValid()) return;

    this.isSubmitting.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.isSubmitting.set(false);
    this.formSubmitted.set(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      this.formName.set('');
      this.formPhone.set('');
      this.formPackageType.set('');
      this.formSubmitted.set(false);
    }, 3000);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
