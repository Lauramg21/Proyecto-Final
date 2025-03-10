import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChildren('benefitCard') benefitCards!: QueryList<ElementRef>;

  slides = [
    {
      type: 'image',
      image: 'assets/img/carrusel1.jpg',
      caption:
        'Gestiona tus equipos con facilidad y lleva el control de cada partido',
      id: 'text1',
    },
    {
      type: 'image',
      image: 'assets/img/carrusel2.jpg',
      caption:
        'Optimiza el rendimiento de cada jugador con datos en tiempo real',
      id: 'text2',
    },
    {
      type: 'image',
      image: 'assets/img/carrusel3.jpg',
      caption: 'Haz que tu equipo brille dentro y fuera del campo',
      id: 'text3',
    },
    {
      type: 'image',
      image: 'assets/img/carrusel4.jpg',
      caption: 'La tecnología al servicio de tu pasión por el deporte',
      id: 'text4',
    },
    {
      type: 'video',
      video: 'assets/videos/video.mp4',
      caption: 'Video promocional',
      id: 'video1',
    },
  ];

  currentIndex = 0;
  interval: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    if (this.slides[this.currentIndex].type === 'video') {
      this.setupVideoListener();
    }
    this.checkScroll(); // Comprobar al inicio
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.checkScroll();
  }

  checkScroll(): void {
    this.benefitCards.forEach((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Si la tarjeta está visible en pantalla, la mostramos
      if (rect.top < windowHeight - 100 && rect.bottom > 100) {
        card.nativeElement.classList.add('visible');
      } else {
        // Si sale completamente de pantalla, se oculta para repetir la animación
        card.nativeElement.classList.remove('visible');
      }
    });
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    if (this.slides[this.currentIndex].type === 'video') {
      const video = this.videoElement.nativeElement;
      video.muted = true;
      video.play();
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;

    if (this.slides[this.currentIndex].type === 'video') {
      setTimeout(() => this.setupVideoListener(), 1000);
    }
  }

  setupVideoListener(): void {
    if (this.videoElement) {
      this.videoElement.nativeElement.onended = () => {
        this.videoElement.nativeElement.pause();
        this.videoElement.nativeElement.currentTime = 0;
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      };
    }
  }
}
