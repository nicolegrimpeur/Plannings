import {Injectable} from '@angular/core';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setLogin(mdp: string) {
    await Storage.set({
      key: 'mdpRp',
      value: mdp,
    });
  }

  async getMdpRp() {
    const {value} = await Storage.get({key: 'mdpRp'});
    return value;
  }
}
