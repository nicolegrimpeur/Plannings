import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Infos, ListeModel} from '../shared/models/liste.model';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
  providers: [HttpService]
})
export class ListePage implements OnInit {
  public liste = new ListeModel();
  public residence = new Infos();

  constructor(
    public user: User,
    public httpService: HttpService,
    public alertController: AlertController,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.recupListe().then();
  }

  async recupListe() {
    await this.httpService.getListe().toPromise()
      .then((results: ListeModel) => {
        this.liste = results;
        this.initResidence();
      })
      .catch(err => {
        this.router.navigate(['/erreur']).then();
      });
  }

  initResidence() {
    this.residence = this.liste.residences.find(res => res.residence === this.user.userData.residence);
  }

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
              this.addPlanning(data.nom);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  addPlanning(id) {
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
