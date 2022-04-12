import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  userRole: string;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }

}
