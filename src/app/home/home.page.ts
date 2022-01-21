import {Component} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {App} from '@capacitor/app';
import {User} from '../shared/class/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private platform: Platform,
    private route: Router,
    private user: User
  ) {
    // gestion de la touche mobile back
    this.platform.backButton.subscribeWithPriority(-1, () => {
      // si l'on est sur la page principale on quitte l'application
      if (this.route.url === '/home') {
        App.exitApp();
      } else if (this.route.url === '/liste') {  // si on est sur la page de liste on va sur la page principale
        this.route.navigate(['/home']).then();
      } else if (this.route.url === '/planning') {  // si on est sur la page de liste on va sur la page principale
        this.route.navigate(['/liste']).then();
      } else if (this.route.url === '/historique') {  // si on est sur la page de liste on va sur la page principale
        this.route.navigate(['/liste']).then();
      } else {  // sinon c'est que l'on est sur la page de login donc on peut quitte l'appli
        App.exitApp();
      }
    });
  }

  ionViewDidEnter() {
    this.user.redirection('home');
  }
}
