import { AppUserMenu } from './../model/user/AppUserMenu';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MainService {
  constructor(private http: HttpClient) {}

  getAppUserMenus(): any {
    return this.http.get<AppUserMenu[]>(
      environment.apiURL + '/user/appUserMenu'
    );
  }
}
