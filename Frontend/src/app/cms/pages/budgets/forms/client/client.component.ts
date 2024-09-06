import { Component, Output , EventEmitter, Input, SimpleChanges} from '@angular/core';
import { Client } from '../../../../interfaces/client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  @Input() client: any = {
    name: '',
    company: '',
    address: '',
    phone: '',
    email: ''
  };

  @Output() clientData = new EventEmitter<Client>();

  changeClientData() {
    this.clientData.emit(this.client);
  }

  ngOnChanges(changes: SimpleChanges) {
  
    if (changes['client']) {
     
      this.client = changes['client'].currentValue;
    }
  }
}
