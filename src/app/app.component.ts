import { Component, OnInit } from '@angular/core';
import { GalleryService } from './services/gallery.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.galleryService.getAlbum().subscribe(console.log);
  }
}
