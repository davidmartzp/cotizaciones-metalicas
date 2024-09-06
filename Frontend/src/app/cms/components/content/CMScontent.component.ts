import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { Component, OnInit ,ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './CMScontent.component.html',
  styleUrl: './CMScontent.component.css',
  encapsulation: ViewEncapsulation.None 
})
export class CMSContentComponent implements OnInit {
  currentRoute: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {  
    this.route.url.subscribe(urlSegments => {
      this.currentRoute = urlSegments.join('/');
    });
  }
}
