import {Component, OnInit} from '@angular/core';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {Display} from '../shared/class/display';
import {HistoriqueModel} from '../shared/models/historique.model';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.page.html',
  styleUrls: ['./historique.page.scss'],
})
export class HistoriquePage implements OnInit {
  public historique = new HistoriqueModel(); // stocke l'historique
  public noSearch = false; // true si la recherche ne renvoi aucun résultat

  constructor(
    public user: User,
    private httpService: HttpService,
    private display: Display
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getHistorique();
  }

  ionViewWillLeave() {
    // on supprime la page active à la sortie de la page
    this.user.deleteCurrentPage();
  }

  // permet de récupérer l'historique
  getHistorique() {
    // on vérifie qu'il n'y a pas de problème avec la page courante
    if (this.user.userData.currentPage !== '') {
      lastValueFrom(this.httpService.getHistorique(
        this.user.userData.currentPage,
        this.user.userData.residence
      ))
        .then(results => {
          this.historique = results;
          // on affiche chaque partie de l'historique
          for (const modif of this.historique.historique) {
            modif.show = true;
          }
        })
        .catch(err => {
          this.display.display(err).then();
        });
    }
  }

  // fonction de recherche
  search(event) {
    // s'il n'y a rien dans la barre de recherche
    if (event.target.value.toLowerCase() === '') {
      // on raffiche tout l'historique
      for (const modif of this.historique.historique) {
        modif.show = true;
        this.noSearch = false;
      }
    } else {
      let tmp = '';
      this.noSearch = true;
      // on parcours tout l'historique pour n'afficher que les éléments qui contiennent la valeur recherché
      for (const modif of this.historique.historique) {
        tmp = modif.show + modif.modification + modif.nom + modif.prenom + modif.chambre + modif.heure + modif.jour;
        modif.show = tmp.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
        if (modif.show && this.noSearch) {
          this.noSearch = false;
        }
      }
    }
  }
}
