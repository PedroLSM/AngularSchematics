import { Component, OnInit, Output, EventEmitter } from '@angular/core';
<% if (auth) { %>
import { AuthService } from 'src/app/services/auth.service';
<% } %>
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav: EventEmitter<void> = new EventEmitter<void>();
  <% if (auth) { %>
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
  }
  <% } else { %>
  constructor(private router: Router) { }
  <% } %>
  ngOnInit() {}

  ToggleSidenav() {
    this.toggleSidenav.emit();
  }
  <% if (auth) { %>
  logout() {
    this.authService.logout();
    location.reload();
  }
  <% } %>
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
