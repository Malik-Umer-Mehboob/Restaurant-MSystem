import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_NUMBER } from '../../config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  whatsappNumber = WHATSAPP_NUMBER;
}
