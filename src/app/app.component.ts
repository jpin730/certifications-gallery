import { animate, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { Category, Certification } from './interfaces/certification.interface';
import { GalleryService } from './services/gallery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .clickable {
        cursor: pointer;
      }
      .preview-img {
        max-height: 100vh;
        max-width: 100%;
      }
      .scroll-to-top {
        opacity: 0.5;
        transition: opacity 300ms;

        &:hover {
          opacity: 0.75;
        }
      }
    `,
  ],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 0.5 })),
      ]),
      transition(':leave', [
        style({ opacity: 0.5 }),
        animate('300ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  filteredCertifications: Certification[] = [];
  filter = '';
  preview = false;
  showScrollToTop = false;
  certification!: Certification;
  categories: Category[] = ['career', 'edteam', 'platzi', 'udemy'];
  // eslint-disable-next-line no-unused-vars
  certifications: { [key in Category | 'all']: Certification[] } = {
    all: [],
    career: [],
    edteam: [],
    platzi: [],
    udemy: [],
  };
  years: string[] = [];

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.galleryService.getAlbum().subscribe((res) => {
      this.certifications.all = res.sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      this.categories.forEach(
        (category) =>
          (this.certifications[category] = this.certifications.all.filter(
            (el) => el.category === category
          ))
      );
      this.filter = this.route.snapshot.queryParamMap.get('filter') || '';
      this.location.replaceState('');
      this.filterCertifications(this.filter);
    });

    fromEvent(document, 'scroll').subscribe(
      () =>
        (this.showScrollToTop = window.pageYOffset / window.screen.height > 0.5)
    );
  }

  filterCertifications(filter: string): void {
    this.filteredCertifications =
      filter && this.categories.includes(filter as Category)
        ? this.certifications[filter as Category]
        : [...this.certifications.all];
    this.years = [
      ...new Set(this.filteredCertifications.map((el) => el.date.slice(0, 4))),
    ];
  }

  openPreview(certification: Certification): void {
    document.body.style.overflowY = 'hidden';
    this.preview = true;
    this.certification = certification;
  }

  closePreview(): void {
    document.body.style.overflowY = '';
    this.preview = false;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
