import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ListeModel} from '../shared/models/liste.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // private baseLink = 'https://nicob.ovh/plannings/';
  private baseLink = 'http://localhost:1080/plannings/';

  constructor(private readonly http: HttpClient) {
  }

  getListe(): Observable<ListeModel> {
    const url = this.baseLink + 'getListPlannings';
    return this.http.get<ListeModel>(url);
  }

  addCreneau(id, residence, jour, heure, nom, prenom, chambre): Observable<any> {
    const url = this.baseLink + 'add/' + id + '+' + residence + '+' + jour + '+' + heure + '+' + nom + '+' + prenom + '+' + chambre;
    return this.http.get<ListeModel>(url);
  }

  removeCreneau(id, residence, jour, heure, nom, prenom, chambre): Observable<any> {
    const url = this.baseLink + 'remove/' + id + '+' + residence + '+' + jour + '+' + heure + '+' + nom + '+' + prenom + '+' + chambre;
  return this.http.get<ListeModel>(url);
}
}
