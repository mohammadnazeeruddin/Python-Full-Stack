import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { allowed_usernames } from '../shared/trueData';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    user = JSON.parse(localStorage.getItem("login_data"));
    

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // if (this.user) {
      //   this.user =this.user['email']
      // }
      // if(allowed_usernames.includes(this.user)) {
      //   return true;
      // } else {
      //   return false;
      // }
      return true
    }
} 
