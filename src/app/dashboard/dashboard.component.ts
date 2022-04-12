import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }

}
