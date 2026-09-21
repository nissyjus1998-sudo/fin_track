import { Component , EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 
  @Output() menuClicked = new EventEmitter<void>();

toggleMenu(): void {
  this.menuClicked.emit();
}
constructor(
  private authService: AuthService,
  private router: Router,
  
) {}
logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}
