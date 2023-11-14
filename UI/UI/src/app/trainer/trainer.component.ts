import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { HttpclientServiceService } from './../httpclient-service.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  material_list: any;

  constructor(
    public media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    public router: Router,
    public http: HttpclientServiceService) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  user: any;

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("login_data"))
    this.getMaterials()
  }

  home() {
    this.router.navigate(['/trainer/groups']);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
    // window.location.reload();
  }

  getMaterials() {
    this.http.getMethod("get/materials").subscribe(
      data => {
        this.material_list = data;
        this.user = JSON.parse(localStorage.getItem("login_data"));
        // if(this.user) {
        //   // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"]);
        //   this.router.navigate(['/trainer']);
        // }
      },
      error => {
        console.log(error);
      }
    )
  }

}
