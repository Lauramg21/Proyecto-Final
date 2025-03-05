import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  slides = [
    {
      image: 'assets/img/carrusel1.jpg',
      caption:
        'Gestiona tus equipos con facilidad y lleva el control de cada partido',
      id: 'text1',
    },
    {
      image: 'assets/img/carrusel2.jpg',
      caption:
        'Gestiona tus equipos con facilidad y lleva el control de cada partido',
      id: 'text2',
    },
    { image: 'assets/img/carrusel1.jpg', caption: 'Frase 3', id: 'text3' },
  ];

  currentIndex = 0;

  ngOnInit(): void {
    // Cambiar de imagen cada 3 segundos automáticamente
    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide(): void {
    this.currentIndex =
      this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
  }
}
