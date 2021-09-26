import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Platform} from '@ionic/angular';
import {Display} from './display';
import {HttpService} from '../../core/http.service';
import {ListeModel} from '../models/liste.model';

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
  public inscriptions;
  private currentUser: any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private display: Display,
    private httpService: HttpService
  ) {
    this.connexion();

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
        if (this.router.url !== '/erreur') {
          if (auth) {
            this.router.navigateByUrl('/').then();
          } else {
            this.router.navigateByUrl('/login').then();
          }
        }
      });
    });
  }

  // redirige l'utilisateur s'il est connecté ou non depuis la page d'erreur
  redirectionErreur() {
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
          this.initInscription().then();
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

  async initInscription() {
    this.inscriptions = [];

    const liste = await this.recupListe().then(result => result);

    const plannings = [];
    for (const objResidence of liste.residences) {
      for (const planning of objResidence.liste) {
        plannings.push({nomPlanning: planning, planning: await this.recupPlanning(planning, objResidence.residence)});
      }
    }

    let debutPlanning;
    let idNb;
    let idInscription;
    let nbInscription;
    for (const planning of plannings) {
      idNb = planning.nomPlanning.search(/[0-9]/g);
      debutPlanning = planning.nomPlanning.slice(0, idNb !== -1 ? idNb : planning.nomPlanning.length - 1);

      nbInscription = 0;
      console.log(this.userData);
      for (const jour in planning.planning) {
        for (const heure in planning.planning[jour]) {
          if (planning.planning[jour][heure].chambre === this.userData.chambre) {
            console.log(planning.planning[jour][heure].chambre, this.userData.chambre);
            nbInscription++;
          }
        }
      }

      idInscription = this.inscriptions.findIndex(res => res.name === debutPlanning);
      if (idInscription === -1) {
        this.inscriptions.push({name: debutPlanning, nbInscriptions: nbInscription});
      }
    }

    console.log(this.inscriptions);
  }

  // on récupère les infos des résidences
  async recupListe() {
    return await this.httpService.getListe().toPromise()
      .then((results: ListeModel) => results)
      .catch(err => {
        this.router.navigate(['/erreur']).then();
        return new ListeModel();
      });
  }

  // récupère un planning
  async recupPlanning(page, res) {
    // on appelle la fonction getPlanning
    return await this.httpService.getPlanning(page, res).toPromise()
      .then(results => results)
      .catch(err => {
        // on redirige vers la page d'erreur
        this.router.navigate(['/erreur']).then();
      });
  }

  addInscription(name) {
    this.manageInscriptions(name, +1);
    console.log(this.inscriptions);
  }

  removeInscription(name) {
    this.manageInscriptions(name, -1);
  }

  manageInscriptions(name, nb) {
    const debutName = name.slice(0, name.search(/[0-9]/g));

    let idInscriptions = this.inscriptions.findIndex(res => res.name === debutName);

    if (idInscriptions === -1) {
      this.inscriptions.push({name: debutName, nbInscriptions: 0});
      idInscriptions = this.inscriptions.length - 1;
    }

    this.inscriptions[idInscriptions].nbInscriptions += nb;
  }
}
