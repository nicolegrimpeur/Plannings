import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Infos, ListeModel} from '../shared/models/liste.model';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {InfosModalPage} from '../shared/modal/infos-modal/infos-modal.page';
import {Display} from '../shared/class/display';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService,]
})
export class ListePage implements OnInit {
  public liste = new ListeModel(); // stocke les infos des résidences
  public residence = new Infos(); // stocke les infos d'une seule résidence

  constructor(
    public user: User,
    public httpService: HttpService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private display: Display
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
      if (res.role !== 'cancel' && res.role !== 'backdrop' && res.data.values.nom !== '') {
        // on ajoute le planning
        await this.addPlanning(res.data.values.nom);
        this.user.initInscription().then();
      }
    });
  }

  // affiche les plannings pour choisir celui à supprimer
  async actionSheet() {
    const tmp = [];

    // on parcours la liste de plannings et on rajoute un bouton pour chaque
    for (const planning of this.residence.liste) {
      tmp.push({
        text: planning,
        role: planning
      });
    }

    // on rajoute le bouton annuler
    tmp.push({
      text: 'Annuler',
      role: 'cancel'
    });

    // création de l'action sheet
    const actionSheet = await this.actionSheetController.create({
      header: 'Quel planning voulez-vous supprimer ?',
      cssClass: 'actionSheet',
      buttons: tmp
    });
    // on affiche l'action sheet
    await actionSheet.present();

    // lorsqu'une sélection est faite, on récupère son attribut
    const {role} = await actionSheet.onDidDismiss();

    if (role !== 'cancel' && role !== 'backdrop') {
      // on supprime le planning correspondant
      await lastValueFrom(this.httpService.supprPlanning(role, this.user.userData.residence));
      // on resynchronise la liste de planning
      await this.recupListe();
    }
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
