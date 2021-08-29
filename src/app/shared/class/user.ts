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
    displayName: ''
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
  }

  // initialise le currentUser
  initCurrentUser() {
    this.currentUser = this.afAuth.currentUser;
    console.log(this.currentUser);
  }

  initInfos() {
    if (this.userData.displayName !== undefined) {
      [this.userData.nom, this.userData.prenom, this.userData.residence, this.userData.chambre, this.userData.isRp] =
        this.userData.displayName.split('+');
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

  // déconnecte l'utilisateur
  logout() {
    this.afAuth.signOut().then();

    this.display.display({code: 'Vous êtes déconnecté', color: 'success'}).then();

    this.userData = {
      nom: undefined,
      prenom: undefined,
      chambre: undefined,
      residence: undefined,
      isRp: undefined,
      mail: undefined,
      displayName: undefined
    };
  }

  // ajoute au compte un nom d'utilisateur
  addDisplayName(name) {
    this.initCurrentUser();
    this.currentUser.updateProfile({ displayName: name })
      .then(res => {
        console.log('ayez', res);
      })
      .catch(err => {
        this.display.display('Erreur lors de l\'ajout du nom d\'utilisateur').then();
      });
  }
}
