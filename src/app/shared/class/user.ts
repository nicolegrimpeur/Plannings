import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Platform} from '@ionic/angular';
import {Display} from './display';
// import firebase from 'firebase';
// import firebase from 'firebase';
// import {firebaseConfig} from '../../app.module';

@Injectable({
  providedIn: 'platform'
})
export class User {
  public userData = {
    nom: '',
    prenom: '',
    chambre: '',
    residence: '',
    isRp: '',
    mail: '',
    displayName: '',
    currentPage: ''
  };
  private currentUser: any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private display: Display
  ) {
    this.connexion();

    // on initialise la base de donnée SDK JS
    // firebase.initializeApp(firebaseConfig);
    this.initCurrentUser();
    this.initInfos();
  }

  // initialise le currentUser
  initCurrentUser() {
    this.currentUser = this.afAuth.currentUser;
  }

  initInfos() {
    if (this.userData.mail !== '' && this.userData.mail !== null) {
      [this.userData.nom, this.userData.prenom, this.userData.residence, this.userData.chambre, this.userData.isRp] =
        this.userData.mail.split('+');
      this.userData.nom = this.userData.nom.substr(0, 1).toLocaleUpperCase() + this.userData.nom.substr(1);
      this.userData.prenom = this.userData.prenom.substr(0, 1).toLocaleUpperCase() + this.userData.prenom.substr(1);
      this.userData.chambre = this.userData.chambre.substr(0, 1).toLocaleUpperCase() + this.userData.chambre.substr(1);
    }
  }

  // test si l'on est sur une page de login
  isLoginPage() {
    return this.router.url === '/login';
  }

  // redirige l'utilisateur s'il est connecté ou non
  redirection() {
    this.platform.ready().then(() => {
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
            this.router.navigateByUrl('/').then();
        } else {
          this.router.navigateByUrl('/login').then();
        }
      });
    });
  }

  // récupère les données de connexion
  connexion() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        if (!auth.isAnonymous) {
          this.userData.mail = auth.email;
          this.userData.displayName = auth.displayName;
          this.initInfos();
        }
      }
    });
  }

  addCurrentPage(page) {
    this.userData.currentPage = page;
  }

  deleteCurrentPage() {
    this.userData.currentPage = '';
  }

  // déconnecte l'utilisateur
  logout() {
    this.afAuth.signOut().then();

    this.display.display({code: 'Vous êtes déconnecté', color: 'success'}).then();

    this.userData = {
      nom: '',
      prenom: '',
      chambre: '',
      residence: '',
      isRp: '',
      mail: '',
      displayName: '',
      currentPage: ''
    };
  }
}
