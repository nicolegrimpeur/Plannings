import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Infos, ListeModel} from '../shared/models/liste.model';
import {ActionSheetController, ModalController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {InfosModalPage} from '../shared/modal/infos-modal/infos-modal.page';
import {Display} from '../shared/class/display';
import {lastValueFrom} from 'rxjs';
import {AjoutGoogleCalendarPage} from "../shared/modal/ajout-google-calendar/ajout-google-calendar.page";
import {InformationsInscriptionModel} from "../shared/models/informations-inscription-model";

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService,]
})
export class ListePage implements OnInit {
  public liste = new ListeModel(); // stocke les infos des résidences
  public residence = new Infos(); // stocke les infos d'une seule résidence
  public mobile = this.platform.platforms();

  constructor(
    public user: User,
    public httpService: HttpService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private modalController: ModalController,
    public display: Display,
    private platform: Platform
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.recupListe().then();
  }

  // on récupère les infos des résidences
  async recupListe() {
    await lastValueFrom(this.httpService.getListe())
      .then((results: ListeModel) => {
        this.liste = results;
        // on initialise les infos de la résidence dont on a besoin
        this.initResidence();
      })
      .catch(() => {
        this.router.navigate(['/erreur']).then();
      });
  }

  // on initialise les infos de la résidence dont on a besoin
  initResidence() {
    this.residence = this.liste.residences.find(res => res.residence === this.user.userData.residence);
    if (this.user.userData.residence !== '' && this.residence === undefined) this.user.logout();
  }

  // demande à l'aide d'une alert quel est le nom du planning à créer
  async alert() {
    await this.display.alertWithInputs('Ajouter un planning', [
      {
        name: 'nom',
        type: 'text',
        placeholder: 'Nom du planning'
      }
    ]).then(async res => {
      if (res.role !== 'cancel' && res.role !== 'backdrop' && res.data.values.nom.replaceAll(' ', '') !== '') {
        // si le planning n'existe pas déjà
        if (this.residence.liste.every(result => result.toLowerCase() !== res.data.values.nom)) {
          // on ajoute le planning
          await this.addPlanning(res.data.values.nom);
          this.user.initInscription().then();
        } else {
          this.display.display('Le planning existe déjà').then();
        }
      }
    });
  }

  async supprPlanning() {
    this.display.actionSheet(this.residence.liste, '', 'Quel planning voulez-vous supprimer ?')
      .then(res => {
        if (res !== 'cancel' && res !== 'backdrop') {
          // on demande une confirmation avant de supprimer la résidence
          this.display.alertWithInputs('Etes vous sur de vouloir supprimer le planning ' + this.residence.liste[res] + ' ?', [])
            .then(async resultat => {
              if (resultat.role === 'ok') {
                const tmp = this.residence.liste;
                // on supprime le planning correspondant
                await lastValueFrom(this.httpService.supprPlanning(this.residence.liste[res], this.user.userData.residence));
                // on resynchronise la liste de planning
                await this.recupListe();

                this.display.display({code: 'Planning ' + tmp[res] + ' supprimé', color: 'success'}).then();
              }
            })
            .catch(() => {
              this.display.display('Une erreur a eu lieu').then();
            })
        }
      })
  }

  async movePlanning() {
    const modal = await this.modalController.create({
      component: InfosModalPage,
      componentProps: {residence: this.residence}
    });

    await modal.present();
    await modal.onDidDismiss();

    // rafraichi le json
    this.recupListe().then();
  }

  async addPlanning(id) {
    // initialise le nouveau planning et refresh la page
    await lastValueFrom(this.httpService.initPlanning(id, this.user.userData.residence)).then();
    this.ionViewWillEnter();
  }

  async recupDonneesCreneaux(): Promise<Array<InformationsInscriptionModel>> {
    // table de correspondance pour les jours et les heures, entre le format d'enregistrement et le format ical
    const tableauCorrespondance = {
      jours: ["dimanche1", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche2"],
      heures: [
        {stocke: "H7", heureIcs: "070000", heureFormate: "7 heures"},
        {stocke: "H8M30", heureIcs: "083000", heureFormate: "8 heures 30"},
        {stocke: "H10", heureIcs: "100000", heureFormate: "10 heures"},
        {stocke: "H11M30", heureIcs: "113000", heureFormate: "11 heures 30"},
        {stocke: "H13M", heureIcs: "130000", heureFormate: "13 heures"},
        {stocke: "H14M30", heureIcs: "143000", heureFormate: "14 heures 30"},
        {stocke: "H16M", heureIcs: "160000", heureFormate: "16 heures"},
        {stocke: "H17M30", heureIcs: "173000", heureFormate: "17 heures 30"},
        {stocke: "H19", heureIcs: "190000", heureFormate: "19 heures"},
        {stocke: "H20M30", heureIcs: "203000", heureFormate: "20 heures 30"},
        {stocke: "H22", heureIcs: "220000", heureFormate: "22 heures"} // jamais dans les inscriptions, évite juste l'overflow pour récupérer l'heure d'après pour l'end time
      ]
    };

    const tableauInformationsInscriptions: Array<InformationsInscriptionModel> = [];

    return await this.user.initInscription().then(() => {
      for (let inscription of this.user.listInscriptions) {
        const jourSemaine = tableauCorrespondance.jours.findIndex(res => res === inscription.jour);

        // time sert de référence en partant du dimanche précédant
        const time = new Date(new Date().setDate(new Date().getDate() - new Date(Date.now()).getDay()));

        let jourInscription;
        jourInscription = new Date(new Date().setTime(time.getTime() + jourSemaine * 86400000));

        const jour = (jourInscription.getDate().toString().length === 1) ? '0' + jourInscription.getDate().toString() : jourInscription.getDate().toString();
        const mois = ((jourInscription.getMonth() + 1).toString().length === 1) ? '0' + (jourInscription.getMonth() + 1).toString() : (jourInscription.getMonth() + 1).toString();
        const pre = jourInscription.getFullYear().toString() + mois + jour;

        const indexHeure = tableauCorrespondance.heures.findIndex(res => res.stocke === inscription.heure);

        if (indexHeure !== -1) {
          tableauInformationsInscriptions.push({
            nomPlanning: inscription.planning,
            heureDebutIcs: tableauCorrespondance.heures[indexHeure].heureIcs,
            heureFinIcs: tableauCorrespondance.heures[indexHeure + 1].heureIcs,
            heureDebutFormate: tableauCorrespondance.heures[indexHeure].heureFormate,
            heureFinFormate: tableauCorrespondance.heures[indexHeure + 1].heureFormate,
            jourIcs: pre,
            jourFormate: jourInscription.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'})
          });
        }
      }

      return tableauInformationsInscriptions;
    });
  }

  async downloadIcs() {
    let icsMSG =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//All Plannings//FR\n" +
      "VERSION:2.0\n";

    this.recupDonneesCreneaux().then(async res => {
      for (let inscription of res) {
        icsMSG +=
          "BEGIN:VEVENT\n" +
          "DTSTART:" +
          inscription.jourIcs + "T" + inscription.heureDebutIcs +
          "\n" +
          "DTEND:" +
          inscription.jourIcs + "T" + inscription.heureFinIcs +
          "\n" +
          "SUMMARY:" +
          "Créneau " + inscription.nomPlanning +
          "\n" +
          "DESCRIPTION:" +
          "" +
          "\n" +
          "END:VEVENT\n";
      }

      icsMSG += "END:VCALENDAR";

      if (res.length === 0) {
        this.display.display('Vous n\'avez pas d\'inscription').then();
      } else {
        if (this.mobile.findIndex(res => res === 'hybrid') !== -1) {
          this.display.alert('Merci d\'utiliser le site Web',
            'Cette fonctionnalité n\'est pas encore disponible via l\'application mobile, merci de passer par le site web pour y accéder').then();
        } else {
          window.open("data:text/calendar;charset=utf8," + encodeURI(icsMSG));
        }
      }

    })

  }

  async addToGoogle() {
    this.recupDonneesCreneaux().then(async res => {
      const modal = await this.modalController.create({
        component: AjoutGoogleCalendarPage,
        componentProps: {tableauInformationsInscriptions: res}
      });

      await modal.present();
      await modal.onDidDismiss();
    });
  }

  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.recupListe().then();
    }, 1000);
  }
}
