import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Infos} from '../../models/liste.model';
import {HttpService} from '../../../core/http.service';
import {Display} from "../../class/display";

@Component({
  selector: 'app-infos-modal',
  templateUrl: './infos-modal.page.html',
  styleUrls: ['./infos-modal.page.scss'],
})
export class InfosModalPage implements OnInit {
  public residence = new Infos(); // stocke les infos d'une seule résidence
  public listPlannings = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private httpService: HttpService,
    private display: Display
  ) {
    this.residence = navParams.get('residence');
    this.listPlannings = this.residence.liste;
  }

  ngOnInit() {
  }

  reorderItems(ev) {
    const itemMove = this.listPlannings.splice(ev.detail.from, 1)[0];
    this.listPlannings.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

  enregistrer() {
    let informations = '';

    for (const label of this.listPlannings) {
      if (label === this.listPlannings[0]) {
        informations += label;
      }
      else {
        informations += '+' + label;
      }
    }

    this.httpService.modifOrdrePlannings(this.residence.residence, informations).toPromise()
      .then(() => {
        this.display.display({code: 'Modifications effectués', color: 'success'}).then();
      })
      .catch(() => {
        this.display.display('Une erreur a eu lieu').then();
      });

    this.dismissModal();
  }

  annuler() {
    this.display.display('Modifications annulés').then();
    this.dismissModal();
  }

  dismissModal() {
      this.modalController.dismiss().then();
  }
}
