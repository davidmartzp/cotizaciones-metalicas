import { Component , ViewEncapsulation} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CMSContentComponent } from '../content/CMScontent.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent , CMSContentComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

}
