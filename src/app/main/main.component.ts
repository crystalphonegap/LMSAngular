import { MainService } from './main.service';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserInfo } from '../model/user/UserInfo';
import { AppUserMenu } from '../model/user/AppUserMenu';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isShowMenuButton: boolean;
  appUserMenus: AppUserMenu[];
  userInfo: UserInfo;

  @ViewChild('drawer', { static: false }) userSideNav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private mainService: MainService) {}

  ngOnInit(): void {
    this.isShowMenuButton = false;
    this.authService.getAuthStatusListener().subscribe((userInfo: UserInfo) => {
      /* console.log('user info ->', userInfo); */
      this.userInfo = userInfo;
      this.isShowMenuButton = false;
      if (userInfo && userInfo.changePassword === false) {
        this.isShowMenuButton = true;
        this.getAppuserMenu();
      }
    });
  }

  getAppuserMenu(): void {
    this.mainService.getAppUserMenus().subscribe((result: AppUserMenu[]) => {
      this.appUserMenus = result;
    });
  }

  sideNavClose(): void {
    this.userSideNav.close();
  }

  logout(): void {
    /* this.userSideNav.close(); */
    this.authService.logout();
  }

}
