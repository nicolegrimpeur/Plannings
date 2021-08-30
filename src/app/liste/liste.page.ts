import { Component, OnInit } from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {ListeModel} from '../shared/models/liste.model';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService]
})
export class ListePage implements OnInit {

  constructor(
    public user: User,
    public httpService: HttpService
  ) {
    console.log(user.userData);
    this.recupListe().then();
  }

  ngOnInit() {
  }

  async recupListe() {
    let liste = new ListeModel();

    await this.httpService.getListe().toPromise().then((results: ListeModel) => {
      liste = results;
    });
  }
}
