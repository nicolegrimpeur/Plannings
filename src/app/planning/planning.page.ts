import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {PlanningModel} from '../shared/models/planning.model';
import {Platform} from '@ionic/angular';
import {remove} from "@angular/fire/database";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {
  public planning = new PlanningModel();
  public jours = [''];
  public heures = [
    '',
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
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1;
  public currentDay = 0;
  private infosCreneau = {
    modification: '',
    jour: '',
    heure: ''
  };

  constructor(
    public user: User,
    private httpService: HttpService,
    private display: Display,
    public platform: Platform
  ) {
    this.initJours();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getPlanning().then();
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
    this.infosCreneau = {
      modification: '',
      jour: '',
      heure: ''
    };
  }

  initJours() {
    const time = new Date(new Date().setDate(new Date().getDate() - new Date(Date.now()).getDay()));
    const options = {weekday: 'long', day: 'numeric', month: 'long'};
    let tmp;

    for (let jour = 0; jour <= 7; jour++) {
      tmp = new Date(new Date().setDate(time.getDate() + jour));
      this.jours.push(tmp.toLocaleDateString('fr-FR', options));
    }
  }

  async getPlanning() {
    if (this.user.userData.currentPage !== '') {
      await this.httpService.getPlanning(
        this.user.userData.currentPage,
        this.user.userData.residence
      ).toPromise()
        .then(results => {
          this.planning = results;
        })
        .catch(err => {
          this.display.display(err).then();
        });
    }
  }

  plusCurrentDay() {
    this.removeConfirm();
    this.currentDay++;
  }

  moinsCurrentDay() {
    this.removeConfirm();
    this.currentDay--;
  }

  getElemPlanning(planning, nb) {
    let compteur = 0;
    let tmp;

    for (const chambre in planning) {
      if (compteur <= nb) {
        tmp = chambre;
      }
      compteur++;
    }
    return tmp;
  }

  clickEvent(jour, heure, idJour, idHeure) {
    if (jour !== undefined && heure !== undefined) {
      if (this.planning[jour][heure].nom === '') {
        if (this.infosCreneau.modification === 'add' && this.infosCreneau.jour === jour && this.infosCreneau.heure === heure) {
          this.addCreneau(jour, heure);
          this.removeConfirm();
        } else {
          this.removeConfirm();
          this.infosCreneau.modification = 'add';
          this.infosCreneau.jour = jour;
          this.infosCreneau.heure = heure;
          this.addConfirm(idJour, idHeure);
        }
      } else if (this.planning[jour][heure].nom === this.user.userData.nom) {
        if ((this.infosCreneau.modification === 'remove' && this.infosCreneau.jour === jour && this.infosCreneau.heure === heure)) {
          this.removeCreneau(jour, heure);
          this.removeConfirm();
        } else {
          this.removeConfirm();
          this.infosCreneau.modification = 'remove';
          this.infosCreneau.jour = jour;
          this.infosCreneau.heure = heure;
          this.addConfirm(idJour, idHeure);
        }
      }
    }
  }

  addConfirm(idJour, idHeure) {
    const col = document.getElementsByClassName('row')[idHeure].children[idJour];

    if (this.infosCreneau.modification === 'add' && col.getAttribute('style') === 'background-color: initial;') {
      col.setAttribute('style', 'background-color: green;');
    }
    else if (this.infosCreneau.modification === 'remove' && col.getAttribute('style') === 'background-color: initial;') {
      col.setAttribute('style', 'background-color: red;');
    }
    else {
      col.setAttribute('style', 'background-color: initial;');
    }
  }

  removeConfirm() {
    this.infosCreneau = {
      modification: '',
      jour: '',
      heure: ''
    };

    for (const row of Array.from(document.getElementsByClassName('row'))) {
      for (const col of Array.from(row.children)) {
        col.setAttribute('style', 'background-color: initial;');
      }
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
        this.ionViewDidEnter();
      })
      .catch(err => {
        if (err.status === 200) {
          this.display.display({code: err.error.text, color: 'success'}).then();
        } else {
          if (err.error.text !== undefined) {
            this.display.display(err.error.text).then();
          } else {
            this.display.display(err.statusText).then();
          }
        }
        this.ionViewDidEnter();
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
      this.ionViewDidEnter();
    })
      .catch(err => {
        if (err.status === 200) {
          this.display.display({code: err.error.text, color: 'success'}).then();
        } else {
          if (err.error.text !== undefined) {
            this.display.display(err.error.text).then();
          } else {
            this.display.display(err.statusText).then();
          }
        }
        this.ionViewDidEnter();
      });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.ionViewDidEnter();
    }, 1000);
  }
}
