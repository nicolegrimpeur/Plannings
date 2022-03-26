import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {InformationsInscriptionModel} from "../../models/informations-inscription-model";

@Component({
  selector: 'app-ajout-google-calendar',
  templateUrl: './ajout-google-calendar.page.html',
  styleUrls: ['./ajout-google-calendar.page.scss'],
})
export class AjoutGoogleCalendarPage implements OnInit {
  public tableauInscriptions: Array<InformationsInscriptionModel> = [];

  constructor(
    public modalController: ModalController,
    private navParams: NavParams
  ) {
    this.tableauInscriptions = navParams.get('tableauInformationsInscriptions');
  }

  ngOnInit() {
  }

}
