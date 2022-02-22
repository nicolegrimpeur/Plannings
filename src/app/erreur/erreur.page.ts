import {Component, OnInit} from '@angular/core';
import {Network} from '@capacitor/network';
import {HttpService} from '../core/http.service';
import {Router} from '@angular/router';
import {User} from '../shared/class/user';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.page.html',
  styleUrls: ['./erreur.page.scss']
})
export class ErreurPage implements OnInit {
  public status; // stocke le status courant
  private interval; // variable d'actualisation

  constructor(
    private httpService: HttpService,
    private router: Router,
    private user: User
  ) {
    // initialise le status
    this.initNetworkStatus().then();
    // on vérifie si l'on peut de nouveau accéder au serveur toutes les 5 secondes
    this.interval = setInterval(() => {
      this.recupListe();
    }, 5000);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.recupListe();
  }

  // initialise le status
  async initNetworkStatus() {
    this.status = await Network.getStatus();
  }

  // récupère la liste sur le serveur
  recupListe() {
    lastValueFrom(this.httpService.getListe())
      .then(res => {
        // si l'on a réussi, on redirige sur la page de connexion ou d'accueil
        this.user.redirectionErreur();
        // on supprime la vérification
        clearInterval(this.interval);
      })
      .catch(err => {
        console.log(err);
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
