import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav: EventEmitter<void> = new EventEmitter<void>();
  currentUser: any;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));
  }

  ngOnInit() {
  }

  CloseSidenav() {
    this.closeSidenav.emit();
  }

  logout() {
    this.closeSidenav.emit();

    this.authService.logout();
    location.reload();
  }

  hasClaim(role: string) {
    return this.authService.getClaimRole() === role;
  }
}
