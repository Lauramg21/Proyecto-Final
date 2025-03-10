import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { captureError } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

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
    },    {
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
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    // Si la diapositiva actual es un video, no cambiar hasta que termine
    if (this.slides[this.currentIndex].type === 'video') {
      this.videoElement.nativeElement.play();
      return;
    }

    this.currentIndex =
      this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;

    if (this.slides[this.currentIndex].type === 'video') {
      setTimeout(() => this.setupVideoListener(), 500);
    }
  }

  setupVideoListener(): void {
    if (this.videoElement) {
      this.videoElement.nativeElement.onended = () => {
        this.currentIndex =
          this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
      };
    }
  }
}
