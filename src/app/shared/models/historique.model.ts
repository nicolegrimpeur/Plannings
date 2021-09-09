export class Infos {
  modification: string;
  dateModif: string;
  nom: string;
  prenom: string;
  chambre: string;
  jour: string;
  heure: string;
  show: boolean;
}

export class HistoriqueModel {
  historique: Array<Infos>;
}
