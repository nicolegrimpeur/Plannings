import {AlertController, ToastController} from '@ionic/angular';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Display {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  // affiche d'un toast contenant le texte de l'erreur
  async display(message: any) {
    let strMessage = message;
    let couleur = 'danger';

    // si l'on donne une couleur dans l'erreur
    if (message.color !== undefined) {
      strMessage = message.code;
      couleur = message.color;
    }

    // création du toast
    const toast = await this.toastController.create({
      message: strMessage,
      duration: 2000,
      position: 'top',
      color: couleur
    });
    // affichage du toast
    await toast.present();
  }

  // création d'une alerte
  async alert(info: string) {
    const alert = await this.alertController.create({
      header: 'Information',
      message: info,
      buttons: ['OK']
    });

    await alert.present();
  }
}
