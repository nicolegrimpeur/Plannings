import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {PlanningModel} from '../shared/models/planning.model';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {
  public planning: PlanningModel;

  constructor(
    public user: User,
    private httpService: HttpService,
    private display: Display
  ) {
    console.log(user.userData.currentPage);
    // this.addCreneau('dimanche1', 'H10');
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getPlanning();
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
  }

  getPlanning() {
    this.httpService.getPlanning(
      this.user.userData.currentPage,
      this.user.userData.residence
    ).toPromise()
      .then(results => {
        this.planning = results;
        console.log('ok', results);
        console.log(this.planning.dimanche1.H7);
      })
      .catch(err => {
        this.display.display(err).then();
      });
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
    ).toPromise()
      .then(results => {
        console.log(results);
      })
      .catch(err => {
        console.log(err);
        if (err.status === 200) {
          this.display.display({code: err.error.text, color: 'success'}).then();
        } else {
          if (err.error.text !== undefined) {
            this.display.display(err.error.text).then();
          } else {
            this.display.display(err.statusText).then();
          }
        }
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
