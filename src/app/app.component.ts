import { animate, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { Certification } from './interfaces/certification.interface';
import { GalleryService } from './services/gallery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
  loading = false;
  filteredCertifications: Certification[] = [];
  filteredCertificationsByYear: { [key: string]: Certification[] } = {};
  filter = '';
  preview = false;
  showScrollToTop = false;
  certification!: Certification;
  categories: string[] = [];
  certifications: Record<string, Certification[]> = {};
  years: string[] = [];
  showAlert = true;

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchCertifications();

    fromEvent(document, 'scroll').subscribe(
      () => (this.showScrollToTop = window.scrollY / window.screen.height > 0.5)
    );
  }

  filterCertifications(filter: string): void {
    this.filteredCertifications =
      filter && this.categories.includes(filter)
        ? this.certifications[filter]
        : [...this.certifications['all']];
    this.years = [
      ...new Set(this.filteredCertifications.map((el) => el.date.slice(0, 4))),
    ];
    this.years.forEach(
      (year) =>
        (this.filteredCertificationsByYear[year] =
          this.filteredCertifications.filter((el) => el.date.startsWith(year)))
    );
    setTimeout(() => {
      this.filter = this.categories.includes(filter) ? filter : '';
    });
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

  fetchCertifications(): void {
    this.loading = true;
    this.galleryService.getAlbum().subscribe({
      next: (res) => {
        this.certifications['all'] = res.sort((a, b) =>
          b.date.localeCompare(a.date)
        );
        this.categories = [
          ...new Set(
            this.certifications['all'].map(({ category }) => category)
          ),
        ].sort((a, b) => a.localeCompare(b));
        this.categories.forEach(
          (category) =>
            (this.certifications[category] = this.certifications['all'].filter(
              (el) => el.category === category
            ))
        );
        this.filterCertifications(
          this.route.snapshot.queryParamMap.get('filter') || ''
        );
        this.location.replaceState('');
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
