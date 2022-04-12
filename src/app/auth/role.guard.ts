import { AuthService } from './auth.service';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let userRoles = this.authService.getUserRole();
        /* console.log(userRole.split(','));*/

        if (!(userRoles instanceof Array)) {
            userRoles = [userRoles];
        }

        if (route.data.roles) {
            let roleFound = false;
            userRoles.every((role) => {
                if (route.data.roles.indexOf(role) !== -1) {
                    roleFound = true;
                    return true;
                }
            });

            if (roleFound) {
                return roleFound;
            }
        }
        this.router.navigate(['']);
        return false;
    }
}
