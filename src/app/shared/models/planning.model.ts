class Data {
  nom: string;
  prenom: string;
  chambre: string;
}

class Horaires {
  H7: Data;
  H8M30: Data;
  H10: Data;
  H11M30: Data;
  H13M: Data;
  H14M30: Data;
  H16M: Data;
  H17M30: Data;
  H19: Data;
  H20M30: Data;
}

export class PlanningModel {
  dimanche1: Horaires;
  lundi: Horaires;
  mardi: Horaires;
  mercredi: Horaires;
  jeudi: Horaires;
  vendredi: Horaires;
  samedi: Horaires;
  dimanche2: Horaires;
}
