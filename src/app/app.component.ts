import {Component} from '@angular/core';
import {User} from './shared/class/user';
import {Router} from '@angular/router';
import {StorageService} from './core/storage.service';
import {lastValueFrom} from "rxjs";
import {HttpService} from './core/http.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [User]
})
export class AppComponent {
  constructor(
    public user: User,
    private router: Router,
    private storageService: StorageService,
    private httpService: HttpService,
    private afAuth: AngularFireAuth
  ) {
    window.addEventListener('load', this.modifRouterOutlet);
    window.addEventListener('resize', this.modifRouterOutlet);
    this.checkMdpRp().then();
  }

  // passe la page en taille pleine pour passer en dessous du tabs
  modifRouterOutlet() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }


  async checkMdpRp() {
    await this.storageService.getMdpRp()
      .then(async result => {
        if (result === null) {
          this.storageService.setLogin('').then();
        } else if (result !== '') {
          lastValueFrom(this.httpService.checkMdpRp(result))
            .then(() => this.thenCheckMdp())
            .catch(err => this.catchCheckMdp(err));
        } else {
          this.user.userData.isRp = 'false';
          this.user.redirection('');
        }
      });
  }

  thenCheckMdp() {
    this.user.userData.isRp = 'true';
    this.router.navigate(['/home']).then();
    this.user.redirection('');
  }

  catchCheckMdp(err) {
    if (err.status === 403) {
      this.user.userData.isRp = 'false';
      this.storageService.setLogin('').then();
      this.afAuth.signOut().then();
      this.router.navigate(['/login']).then();
    } else {
      this.router.navigate(['/erreur']).then();
    }
  }
}
