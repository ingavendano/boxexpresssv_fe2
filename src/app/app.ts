import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private titleService = inject(Title);
  private viewportScroller = inject(ViewportScroller);

  isAuthPage = signal(false);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll to top on route change
      this.viewportScroller.scrollToPosition([0, 0]);

      // Update title based on route
      const url = this.router.url;
      this.isAuthPage.set(url.includes('/login') || url.includes('/register') || url.includes('/admin'));

      if (url.includes('about-us')) {
        this.titleService.setTitle('Sobre Nosotros | Box Express de El Salvador');
      } else if (url.includes('login')) {
        this.titleService.setTitle('Iniciar Sesión | Box Express de El Salvador');
      } else if (url.includes('register')) {
        this.titleService.setTitle('Registrarse | Box Express de El Salvador');
      } else {
        this.titleService.setTitle('Box Express de El Salvador | Envíos a El Salvador');
      }
    });
  }
}
