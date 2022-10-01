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
  categories: Category[] = ['career', 'edteam', 'platzi', 'udemy'];
  years: string[] = [];

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.galleryService.getAlbum().subscribe((res) => {
      this.certifications = res.sort((a, b) => b.date.localeCompare(a.date));
      const filter = this.route.snapshot.queryParamMap.get('filter') || '';
      this.filterCertifications(filter);
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
}
