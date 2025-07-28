import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isImage' })
export class IsImagePipe implements PipeTransform {
  transform(media: string): boolean | string {
    if (!media) {
      return false; // Handle null or undefined media
    }
    // Check Base64 or file extensions
    return media.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|bmp)$/i.test(media);
  }
}
