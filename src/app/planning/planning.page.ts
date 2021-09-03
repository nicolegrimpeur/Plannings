import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  constructor(
    public user: User,
    public httpService: HttpService
  ) {
    console.log(user.userData.currentPage);
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
  }
}
