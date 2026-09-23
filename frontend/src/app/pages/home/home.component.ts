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

  // Demo testimonials — for display only, not pulled from real customer data.
  testimonials = [
    { name: 'Ayesha K.', quote: 'Best chicken karahi in Malir, hands down. The order arrived really quickly too.' },
    { name: 'Bilal R.', quote: 'The chapli kebab tastes just like the ones from Peshawar — crispy on the outside and juicy inside.' },
    { name: 'Sana M.', quote: 'Ordering through WhatsApp is so easy, and the biryani always arrives hot.' },
    { name: 'Hamza T.', quote: 'The Bihari boti is smoky and tender — the whole family loved it.' },
    { name: 'Fatima A.', quote: 'The portion sizes are generous and the prices are fair. This is our go-to place now.' },
    { name: 'Danish S.', quote: 'The nihari has an authentic taste with a real dhaba-style feel.' },
  ];
}