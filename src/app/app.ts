import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'Crown Chronicles';

  ngOnInit() {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#1f2937';
    document.body.style.color = '#f9fafb';
  }

}