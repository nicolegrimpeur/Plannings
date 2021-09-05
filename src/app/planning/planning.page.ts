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
  public jours = [];
  public heures: [
    '7H -> 8H30',
    '8H30 -> 10H',
    '10H -> 11H30',
    '11H30 -> 13H',
    '13H -> 14H30',
    '14H30 -> 16H',
    '16H -> 17H30',
    '17H30 -> 19H',
    '19H -> 20H30',
    '20H30 -> 22H',
  ];

  constructor(
    public user: User,
    private httpService: HttpService,
    private display: Display
  ) {
    console.log(user.userData.currentPage);
    // this.addCreneau('dimanche1', 'H10');
  }

  ngOnInit() {
    this.initJours();
  }

  ionViewDidEnter() {
    this.getPlanning();
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
  }

  initJours() {
    const time = new Date(new Date().setDate(new Date().getDate() - new Date(Date.now()).getDay()));
    const options = {weekday: 'long', day: 'numeric', month: 'long'};;
    let tmp;

    for (let jour = 0; jour <= 7; jour++) {
      tmp = new Date(new Date().setDate(time.getDate() + jour));
      this.jours.push(tmp.toLocaleDateString('fr-FR', options));
    }
  }

  getPlanning() {
    if (this.user.userData.currentPage !== '') {
      this.httpService.getPlanning(
        this.user.userData.currentPage,
        this.user.userData.residence
      ).toPromise()
        .then(results => {
          this.planning = results;
        })
        .catch(err => {
          console.log(err);
          this.display.display(err).then();
        });
    }
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
