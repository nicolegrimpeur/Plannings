import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {PlanningModel} from '../shared/models/planning.model';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {
  public planning = new PlanningModel(); // variable qui stockera le planning
  public jours = ['']; // stocke les différents jours de la semaine
  public heures = [ // stocke les horaires de la semaine
    '',
    '7H -> 8H30',
    '8H30 -> 10H',
    '10H -> 11H30',
    '11H30 -> 13H',
    '13H -> 14H30',
    '14H30 -> 16H',
    '16H -> 17H30',
    '17H30 -> 19H',
    '19H -> 20H30',
    '20H30 -> 22H',
  ];
  public mobile = this.platform.platforms().findIndex(res => res === 'mobile') !== -1; // true si l'on est sur téléphone, false sinon
  public currentDay = 0; // premier jour, utile pour stocker le jour en cours pour l'affichage sur mobile
  private infosCreneau = { // infos d'inscription / suppression du créneau
    modification: '',
    jour: '',
    heure: ''
  };
  private interval; // variable d'actualisation du planning

  constructor(
    public user: User,
    private httpService: HttpService,
    public display: Display,
    private platform: Platform,
    private router: Router
  ) {
    this.initJours(); // on initialise les jours de la semaine
    // on vérifie si l'on peut de nouveau accéder au serveur toutes les 5 secondes
    this.interval = setInterval(() => {
      this.getPlanning().then();
    }, 5000);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // à chaque entré dans la page on actualise le planning
    this.getPlanning().then();
  }

  ionViewWillLeave() {
    // on supprime la page courante
    this.user.deleteCurrentPage();
    // on remet à 0 les infos d'inscription du créneau
    this.infosCreneau = {
      modification: '',
      jour: '',
      heure: ''
    };
  }

  // initialisation des jours de la semaine
  initJours() {
    // time sert de référence en partant du dimanche précédant
    const time = new Date(new Date().setDate(new Date().getDate() - new Date(Date.now()).getDay()));
    // option pour l'affichage de la date
    const options = {weekday: 'long', day: 'numeric', month: 'long'};
    let tmp;

    for (let jour = 0; jour <= 7; jour++) {
      // tmp stocke le jour correspondant à la date dimanche précédant + jour
      tmp = new Date(new Date().setDate(time.getDate() + jour));
      // on l'ajoute dans le tableau de jour
      this.jours.push(tmp.toLocaleDateString('fr-FR', options));
    }
  }

  // récupère les plannings
  async getPlanning() {
    // on vérifie que la page c'est bien lancé pour éviter toute erreur lors de l'appel du planning
    if (this.user.userData.currentPage !== '') {
      // on appelle la fonction getPlanning
      await this.httpService.getPlanning(
        this.user.userData.currentPage,
        this.user.userData.residence
      ).toPromise()
        .then(results => {
          // on stocke les résultats
          this.planning = results;
        })
        .catch(err => {
          // on redirige vers la page d'erreur
          this.router.navigate(['/erreur']).then();
        });
    }
  }

  // fonctions liés au flèche pour afficher les jours sur mobile
  plusCurrentDay() {
    this.removeConfirm();
    if (this.currentDay < 7) {
      this.currentDay++;
    }
  }

  moinsCurrentDay() {
    this.removeConfirm();
    if (this.currentDay >= 1) {
      this.currentDay--;
    }
  }

  // permet d'obtenir le nom de l'élément à l'indice nb dans l'objet planning
  getElemPlanning(planning, nb) {
    let compteur = 0;
    let tmp;

    // on parcours le planning, si l'on est sur l'indice demandé, on retourne le nom de l'élément
    // eslint-disable-next-line guard-for-in
    for (const chambre in planning) {
      if (compteur <= nb) {
        tmp = chambre;
      }
      compteur++;
    }
    return tmp;
  }

  // event au click sur une case
  clickEvent(jour, heure, idJour, idHeure) {
    // on vérifie que la case clické correspond bien à une vrai case
    if (jour !== undefined && heure !== undefined) {
      // si la case est vide
      if (this.planning[jour][heure].nom === '') {
        // si on a initialisé l'inscription
        if (this.infosCreneau.modification === 'add' && this.infosCreneau.jour === jour && this.infosCreneau.heure === heure) {
          // on s'inscrit
          this.addCreneau(jour, heure);
          // on supprime les couleurs sur les cases
          this.removeConfirm();
        } else { // sinon on initialise l'inscription
          // on supprime les couleurs sur les cases
          this.removeConfirm();
          // on enregistre les infos d'inscription
          this.infosCreneau.modification = 'add';
          this.infosCreneau.jour = jour;
          this.infosCreneau.heure = heure;
          // on ajoute la couleur
          this.addConfirm(idJour, idHeure);
        }
      // sinon on vérifie si le numéro de chambre et le nom correspondent pour supprimer le créneau
      } else if (this.planning[jour][heure].chambre === this.user.userData.chambre &&
        this.planning[jour][heure].nom === this.user.userData.nom) {
        // on vérifie qu'on a déjà initialisé la suppression
        if ((this.infosCreneau.modification === 'remove' && this.infosCreneau.jour === jour && this.infosCreneau.heure === heure)) {
          // on supprime le créneau
          this.removeCreneau(jour, heure);
          // on enlève les couleurs
          this.removeConfirm();
        } else { // sinon on initialise la suppression
          // on enlève les couleurs des cases
          this.removeConfirm();
          // on enregistre les infos de suppression
          this.infosCreneau.modification = 'remove';
          this.infosCreneau.jour = jour;
          this.infosCreneau.heure = heure;
          // on met la couleur sur la case
          this.addConfirm(idJour, idHeure);
        }
      }
    } else {
      this.removeConfirm();
    }
  }

  // ajoute la couleur
  addConfirm(idJour, idHeure) {
    const col = document.getElementsByClassName('row')[idHeure].children[idJour];

    // change la couleur de la case selon le theme de l'appareil
    const baseRed = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'darkred' : '#FEC0AA';
    const baseGreen = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // si l'on ajoute, la couleur passe en vert
    if (this.infosCreneau.modification === 'add' && col.getAttribute('style') === 'background-color: initial;') {
      col.setAttribute('style', 'background-color: ' + baseGreen + 'green;');
    }
    // si on enlève, la couleur passe en rouge
    else if (this.infosCreneau.modification === 'remove' && col.getAttribute('style') === 'background-color: initial;') {
      col.setAttribute('style', 'background-color: ' + baseRed + ';');
    }
    // sinon on remet la couleur de base
    else {
      col.setAttribute('style', 'background-color: initial;');
    }
  }

  // supprime les couleurs de toutes les cases
  removeConfirm() {
    this.infosCreneau = {
      modification: '',
      jour: '',
      heure: ''
    };

    // on parcours toutes les lignes
    for (const row of Array.from(document.getElementsByClassName('row'))) {
      // on parcours toutes les colonnes d'une ligne
      for (const col of Array.from(row.children)) {
        // on remet la case à la couleur initiale
        col.setAttribute('style', 'background-color: initial;');
      }
    }
  }

  // ajout du créneau
  addCreneau(jour, heure) {
    this.httpService.addCreneau(
      this.user.userData.currentPage,
      this.user.userData.residence,
      jour,
      heure,
      this.user.userData.nom,
      this.user.userData.prenom,
      this.user.userData.chambre
    ).toPromise()
      .then(results => {
        this.ionViewDidEnter();
      })
      .catch(err => {
        this.catchCreneau(err);
      });
  }

  // supprime un créneau
  removeCreneau(jour, heure) {
    this.httpService.removeCreneau(
      this.user.userData.currentPage,
      this.user.userData.residence,
      jour,
      heure,
      this.user.userData.nom,
      this.user.userData.prenom,
      this.user.userData.chambre
    ).toPromise().then(results => {
      this.ionViewDidEnter();
    })
      .catch(err => {
        this.catchCreneau(err);
      });
  }

  catchCreneau(err) {
    // le serveur renvoi une erreur 200 pour confirmer l'inscription
    if (err.status === 200) {
      this.display.display({code: err.error.text, color: 'success'}).then();
    } else { // sinon c'est qu'il y a eu une erreur
      if (err.error.text !== undefined) {
        this.display.display(err.error.text).then();
      } else {
        this.display.display(err.statusText).then();
      }
    }
    // on refresh la page
    this.ionViewDidEnter();
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.ionViewDidEnter();
    }, 1000);
  }
}
