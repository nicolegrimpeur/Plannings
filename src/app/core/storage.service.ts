import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setLogin(mdp: string) {
    await Preferences.set({
      key: 'mdpRp',
      value: mdp,
    });
  }

  async getMdpRp() {
    const {value} = await Preferences.get({key: 'mdpRp'});
    return value;
  }
}
