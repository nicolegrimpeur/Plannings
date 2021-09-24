import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Infos, ListeModel} from '../shared/models/liste.model';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService]
})
export class ListePage implements OnInit {
  public liste = new ListeModel(); // stocke les infos des résidences
  public residence = new Infos(); // stocke les infos d'une seule résidence

  constructor(
    public user: User,
    public httpService: HttpService,
    public alertController: AlertController,
    private router: Router,
    public actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.recupListe().then();
  }

  // on récupère les infos des résidences
  async recupListe() {
    await this.httpService.getListe().toPromise()
      .then((results: ListeModel) => {
        this.liste = results;
        // on initialise les infos de la résidence dont on a besoin
        this.initResidence();
      })
      .catch(err => {
        this.router.navigate(['/erreur']).then();
      });
  }

  // on initialise les infos de la résidence dont on a besoin
  initResidence() {
    this.residence = this.liste.residences.find(res => res.residence === this.user.userData.residence);
  }

  // demande à l'aide d'une alert quel est le nom du planning à créer
  async alert() {
    const alert = await this.alertController.create({
      header: 'Ajouter un planning',
      inputs: [
        {
          name: 'nom',
          type: 'text',
          placeholder: 'Nom du planning'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: data => {
            if (data.nom !== '') {
              // on ajoute le planning
              this.addPlanning(data.nom);
            }
          }
        }
      ]
    });

    // on affiche l'alerte
    await alert.present();
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

    if (role !== 'cancel') {
      // on supprime le planning correspondant
      await this.httpService.supprPlanning(role, this.user.userData.residence).toPromise();
      // on resynchronise la liste de planning
      await this.recupListe();
    }
  }

  addPlanning(id) {
    // initialise le nouveau planning et refresh la page
    this.httpService.initPlanning(id, this.user.userData.residence).toPromise().then();
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
