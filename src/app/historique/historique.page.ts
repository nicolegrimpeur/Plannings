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
        })
        .catch(err => {
          this.display.display(err).then();
        });
    }
  }

}
