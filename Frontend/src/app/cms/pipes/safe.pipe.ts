import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment'; // Import the environment file


@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    // use the assetsUrl from the environment file for create an absolute url
    url = environment.assetsUrl + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
