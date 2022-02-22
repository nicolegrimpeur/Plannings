import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ListeModel} from '../shared/models/liste.model';
import {PlanningModel} from '../shared/models/planning.model';
import {HistoriqueModel} from '../shared/models/historique.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseLink = environment.base + 'plannings/';

  constructor(private readonly http: HttpClient) {
  }

  getListe(): Observable<ListeModel> {
    const url = this.baseLink + 'getListPlannings';
    return this.http.get<ListeModel>(url);
  }

  getPlanning(id, residence): Observable<PlanningModel> {
    const url = this.baseLink + 'getPlanning/' + id + '/' + residence;
    return this.http.get<PlanningModel>(url);
  }

  getHistorique(id, residence): Observable<HistoriqueModel> {
    const url = this.baseLink + 'getHistorique/' + id + '/' + residence;
    return this.http.get<HistoriqueModel>(url);
  }

  addCreneau(id, residence, jour, heure, nom, prenom, chambre): Observable<any> {
    const url = this.baseLink + 'add';
    const data = {
      id, residence, jour, heure, nom, prenom, chambre
    }
    return this.http.post<any>(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  removeCreneau(id, residence, jour, heure, nom, prenom, chambre): Observable<any> {
    const url = this.baseLink + 'remove';
    const data = {
      id, residence, jour, heure, nom, prenom, chambre
    }
    return this.http.post<any>(url, data, {headers: {'Content-Type': 'application/json'}});
  }

  initPlanning(id, residence) {
    const url = this.baseLink + 'init/' + residence + '/' + id;
    return this.http.get<any>(url);
  }

  supprPlanning(id, residence) {
    const url = this.baseLink + 'removeFile/' + residence + '/' + id;
    return this.http.get<any>(url);
  }

  modifOrdrePlannings(residence, informations) {
    const url = this.baseLink + 'modifOrdrePlannings/' + residence + '/' + informations + '+OkPourModifs';
    return this.http.get<any>(url);
  }

  checkMdpRp(mdp): Observable<any> {
    const url = environment.base + 'mdpRp';
    return this.http.post<any>(url, {mdp});
  }

  checkMdpAll(mdp): Observable<any> {
    const url = environment.base + 'mdpRp/all';
    return this.http.post<any>(url, {mdp});
  }

  createRes(id, name): Observable<any> {
    const url = this.baseLink + 'createRes/' + id + '/' + name;
    return this.http.get<any>(url);
  }

  supprRes(id, name): Observable<any> {
    const url = this.baseLink + 'supprRes/' + id + '/' + name;
    return this.http.get<any>(url);
  }
}
