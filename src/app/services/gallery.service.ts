import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs';
import { Certification } from '../interfaces/certification.interface';

@Injectable()
export class GalleryService {
  private collectionName = 'certifications';

  constructor(private firestore: AngularFirestore) {}

  getAlbum() {
    return this.firestore
      .collection<Certification>(this.collectionName)
      .valueChanges()
      .pipe(take(1));
  }
}
