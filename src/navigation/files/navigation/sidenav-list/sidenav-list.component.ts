import { Component, OnInit, Output, EventEmitter } from '@angular/core';
<% if (auth) { %>import { AuthService } from 'src/app/services/auth.service';<% } %>

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  <% if (auth) { %>
  currentUser: any;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
  }
  <% } else { %>
  constructor() { }
  <% } %>
  ngOnInit() { }

  CloseSidenav() {
    this.closeSidenav.emit();
  }
  <% if (auth) { %>
  logout() {
    this.closeSidenav.emit();

    this.authService.logout();
    location.reload();
  }

  hasClaim(role: string) {
    return this.authService.getClaimRole() === role;
  }
  <% } %>
}
