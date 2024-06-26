import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Platform} from '@ionic/angular';
import {Display} from './display';
import {HttpService} from '../../core/http.service';
import {ListeModel} from '../models/liste.model';
import {lastValueFrom} from 'rxjs';
import {StorageService} from '../../core/storage.service';

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
  public listInscriptions;
  private currentUser: any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private display: Display,
    private httpService: HttpService,
    private storageService: StorageService
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
      this.userData.nom = this.userData.nom.substring(0, 1).toLocaleUpperCase() + this.userData.nom.substring(1);
      this.userData.prenom = this.userData.prenom.substring(0, 1).toLocaleUpperCase() + this.userData.prenom.substring(1);
      this.userData.chambre = this.userData.chambre.substring(0, 1).toLocaleUpperCase() + this.userData.chambre.substring(1);
    }
  }

  // test si l'on est sur une page de login
  isLoginPage() {
    return this.router.url === '/login';
  }

  // redirige l'utilisateur s'il est connecté ou non
  redirection(link) {
    this.platform.ready().then(() => {
      this.afAuth.authState.subscribe(auth => {
        if (this.router.url !== '/erreur') {
          if (auth) {
            if (link === '') {
              this.router.navigateByUrl('/').then();
            }
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
          this.isResUndefined();
        }
      }
    });
  }

  // enregistre la page active
  addCurrentPage(page) {
    this.userData.currentPage = page;
  }

  // supprimer la page active
  deleteCurrentPage() {
    this.userData.currentPage = '';
  }

  // déconnecte l'utilisateur
  logout(deleteAccount = false) {
    if (deleteAccount) {
      this.currentUser.delete();
    } else {
      this.afAuth.signOut().then();
    }

    this.storageService.setLogin('').then();

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

    this.router.navigateByUrl('/login').then();
  }

  // initialise le tableau d'inscriptions
  async initInscription() {
    this.inscriptions = [];
    this.listInscriptions = [];

    // on récupère la liste des plannings pour cette résidence
    const liste = await this.recupListe().then(result => result);

    const plannings = [];
    // on récupère les infos qui correspondent à la résidence
    if (liste.residences !== undefined) {
      const objResidence = liste.residences.find(res => res.residence.toLowerCase() === this.userData.residence);
      if (objResidence !== undefined) {
        // on parcourt la liste des plannings de la résidence pour ajouter chaque planning à plannings
        for (const planning of objResidence.liste) {
          plannings.push({nomPlanning: planning, planning: await this.recupPlanning(planning, objResidence.residence)});
        }

        let debutPlanning;
        let idNb;
        let idInscription;
        let nbInscription;
        // on parcourt tous les plannings de la résidence
        for (const planning of plannings) {
          // on récupère le début du nom du plannings (exemple Machine 1 donne Machine )
          idNb = planning.nomPlanning.search(/[0-9]/g);
          debutPlanning = planning.nomPlanning.slice(0, idNb !== -1 ? idNb : planning.nomPlanning.length);

          nbInscription = 0;
          // on parcourt le planning en cours
          for (const jour in planning.planning) {
            // permet d'éviter de considérer le dimanche précédent comme partie courante de la semaine
            if (jour !== 'dimanche1') {
              for (const heure in planning.planning[jour]) {
                // si le numéro de chambre lui correspond, alors on lui rajoute une inscription sur ce planning
                if (planning.planning[jour][heure].chambre === this.userData.chambre) {
                  nbInscription++;
                  this.listInscriptions.push({planning: planning.nomPlanning, jour, heure});
                }
              }
            }
          }

          // on ajoute les inscriptions obtenus au tableau d'inscriptions
          idInscription = this.inscriptions.findIndex(res => res.name === debutPlanning);
          if (idInscription === -1) {
            this.inscriptions.push({name: debutPlanning, nbInscriptions: nbInscription});
          } else {
            this.inscriptions[idInscription].nbInscriptions += nbInscription;
          }
        }
      }
    }
  }

  isResUndefined() {
    if (this.userData.residence === undefined || this.userData.residence === 'undefined') {
      this.logout(true);
    }
  }

  // on récupère les infos des résidences
  async recupListe() {
    return await lastValueFrom(this.httpService.getListe())
      .then((results: ListeModel) => results)
      .catch(err => {
        this.router.navigate(['/erreur']).then();
        return new ListeModel();
      });
  }

  // récupère un planning
  async recupPlanning(page, res) {
    // on appelle la fonction getPlanning
    return await lastValueFrom(this.httpService.getPlanning(page, res))
      .then(results => results)
      .catch(err => {
        // on redirige vers la page d'erreur
        this.router.navigate(['/erreur']).then();
      });
  }

  // ajoute une inscription
  addInscription(name) {
    this.manageInscriptions(name, +1);
  }

  // supprime une inscription
  removeInscription(name) {
    this.manageInscriptions(name, -1);
  }

  // manipule le tableau d'inscription pour rajouter ou enlever une inscription
  manageInscriptions(name, nb) {
    const idNb = this.userData.currentPage.search(/[0-9]/g);
    const debutName = name.slice(0, (idNb !== -1 ? idNb : name.length));

    let idInscriptions = this.inscriptions.findIndex(res => res.name === debutName);

    if (idInscriptions === -1) {
      this.inscriptions.push({name: debutName, nbInscriptions: 0});
      idInscriptions = this.inscriptions.length - 1;
    }

    this.inscriptions[idInscriptions].nbInscriptions += nb;
  }
}
