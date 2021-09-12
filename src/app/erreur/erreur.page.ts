import {Component, OnInit} from '@angular/core';
import {Network} from '@capacitor/network';
import {HttpService} from '../core/http.service';
import {Router} from '@angular/router';
import {User} from '../shared/class/user';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.page.html',
  styleUrls: ['./erreur.page.scss']
})
export class ErreurPage implements OnInit {
  public status;
  private interval;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private user: User
  ) {
    this.initNetworkStatus().then();
    this.interval = setInterval(() => {
      this.recupListe();
    }, 5000);
  }

  ngOnInit() {
  }

  async initNetworkStatus() {
    this.status = await Network.getStatus();
  }

  recupListe() {
    this.httpService.getListe().toPromise()
      .then(res => {
        // this.router.navigate(['/']).then();
        this.user.redirectionErreur();
        clearInterval(this.interval);
      })
      .catch(err => {
      });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // rafraichi le json
      this.recupListe();
      // permet de terminer l'animation
      event.target.complete();
    }, 1000);
  }
}
