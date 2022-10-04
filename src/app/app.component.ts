import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Certification } from './interfaces/certification.interface';
import { GalleryService } from './services/gallery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['.form-select {cursor: pointer}'],
})
export class AppComponent implements OnInit {
  certifications: Certification[] = [];
  filteredCertifications: Certification[] = [];
  filter = '';
  preview = false;
  certification!: Certification;
  categories: Category[] = ['career', 'edteam', 'platzi', 'udemy'];
  years: string[] = [];

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.galleryService.getAlbum().subscribe((res) => {
      this.certifications = res.sort((a, b) => b.date.localeCompare(a.date));
      this.filter = this.route.snapshot.queryParamMap.get('filter') || '';
      this.location.replaceState('');
      this.filterCertifications(this.filter);
    });
  }

  filterCertifications(filter: string): void {
    this.filteredCertifications =
      filter && this.categories.includes(filter as Category)
        ? this.certifications.filter((el) => el.category === filter)
        : [...this.certifications];
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
}
