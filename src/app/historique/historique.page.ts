import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {HistoriqueModel} from '../shared/models/historique.model';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.page.html',
  styleUrls: ['./historique.page.scss'],
})
export class HistoriquePage implements OnInit {
  public historique = new HistoriqueModel();
  public noSearch = false;

  constructor(
    public user: User,
    private httpService: HttpService,
    private display: Display
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getHistorique();
  }

  ionViewWillLeave() {
    this.user.deleteCurrentPage();
  }

  getHistorique() {
    if (this.user.userData.currentPage !== '') {
      this.httpService.getHistorique(
        this.user.userData.currentPage,
        this.user.userData.residence
      ).toPromise()
        .then(results => {
          this.historique = results;
          for (const modif of this.historique.historique) {
            modif.show = true;
          }
        })
        .catch(err => {
          this.display.display(err).then();
        });
    }
  }

  search(event) {
    if (event.target.value.toLowerCase() === '') {
      for (const modif of this.historique.historique) {
        modif.show = true;
        this.noSearch = false;
      }
    } else {
      let tmp = '';
      this.noSearch = true;
      for (const modif of this.historique.historique) {
        tmp = modif.show + modif.modification + modif.nom + modif.prenom + modif.chambre + modif.heure + modif.jour;
        modif.show = tmp.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
        if (modif.show && this.noSearch) {
          this.noSearch = false;
        }
      }
    }
  }
}
