import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {ListeModel} from "../shared/models/liste.model";

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
    this.addCreneau('dimanche1', '7H');
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
  }

  addCreneau(jour, heure) {
    this.httpService.addCreneau(
      this.user.userData.currentPage,
      this.user.userData.residence,
      jour,
      heure,
      this.user.userData.nom,
      this.user.userData.prenom,
      this.user.userData.chambre
    ).toPromise().then(results => {
      console.log(results);
    });
  }

  removeCreneau(jour, heure) {
    this.httpService.removeCreneau(
      this.user.userData.currentPage,
      this.user.userData.residence,
      jour,
      heure,
      this.user.userData.nom,
      this.user.userData.prenom,
      this.user.userData.chambre
    ).toPromise().then(results => {
      console.log(results);
    });
  }
}
