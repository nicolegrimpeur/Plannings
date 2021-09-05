import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Infos, ListeModel} from '../shared/models/liste.model';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService]
})
export class ListePage implements OnInit {
  public liste = new ListeModel();
  public residence = new Infos();

  constructor(
    public user: User,
    public httpService: HttpService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.recupListe().then();
  }

  async recupListe() {
    await this.httpService.getListe().toPromise().then((results: ListeModel) => {
      this.liste = results;
      this.initResidence();
    });
  }

  initResidence() {
    this.residence = this.liste.residences.find(res => res.residence === this.user.userData.residence);
  }
}
