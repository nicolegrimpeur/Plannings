import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import {Display} from '../shared/class/display';
import {HttpService} from '../core/http.service';
import {ListeModel} from '../shared/models/liste.model';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputMdp') inputMdp;
  @ViewChild('iconMdp') iconMdp;

  // data utilisés pour la connexion
  public loginData = {
    nom: '',
    prenom: '',
    residence: '',
    chambre: '',
    isRp: 'false',
    mdpRp: '',
    mail: ''
  };

  // pour stocker la liste des résidences
  public liste = new ListeModel();

  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public display: Display,
    public httpService: HttpService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loginData = {
      nom: '',
      prenom: '',
      residence: '',
      chambre: '',
      isRp: 'false',
      mdpRp: '',
      mail: ''
    };

    this.recupListe().then();
  }

  // corrige le mail si besoin
  checkMail() {
    while (this.loginData.mail.indexOf(' ') !== -1) {
      this.loginData.mail = this.loginData.mail.replace(' ', '-');
    }
  }

  // connecte l'utilisateur avec email et mot de passe
  async login() {
    let mdpCorrect = '';

    // si un mot de passe a été rentré, on le teste
    if (this.loginData.mdpRp !== '' && this.loginData.isRp === 'true') {
      // si le mot de passe est incorrect on bloque la connexion
      await lastValueFrom(this.httpService.checkMdpRp(this.loginData.mdpRp)).then().catch(result => {
        if (result.status !== 200) {
          this.display.display('Mauvais mot de passe').then();
          this.loginData.mdpRp = '';
          mdpCorrect = 'false';
        } else {
          mdpCorrect = 'true';
        }
      });
    }

    // si le mot de passe est correct ou si aucun mot de passe n'a été rentré
    if (mdpCorrect === '' || mdpCorrect === 'true') {
      this.loginData.mail =
        this.loginData.nom + '+' +
        this.loginData.prenom + '+' +
        this.loginData.residence + '+' +
        this.loginData.chambre + '+' +
        ((mdpCorrect === '') ? 'false' : mdpCorrect) +
        '+planning@all.fr';

      // pour corriger le mail (remplacement espace par tiret)
      this.checkMail();

      const password = 'f355bcd8af0541b815c00eda1360a30024c2ae8bfc53ead1073bf29b7589cc64';

      // on regarde si un compte existe déjà avec cette email
      this.afAuth.fetchSignInMethodsForEmail(this.loginData.mail)
        .then(res => {
          // si oui on connecte l'utilisateur
          if (res.length === 1) {
            this.afAuth.signInWithEmailAndPassword(this.loginData.mail, password)
              .then(auth => {
                // on redirige l'utilisateur sur la page d'accueil
                this.router.navigateByUrl('/').then();
              })
              .catch(err => {
                // sinon on affiche une erreur
                this.display.display(err).then();
              });
          } else { // sinon on créé un compte
            this.afAuth.createUserWithEmailAndPassword(this.loginData.mail, password)
              .then(auth => {
                // on redirige l'utilisateur sur la page d'accueil
                this.router.navigateByUrl('/').then();
              })
              .catch(err => {
                // sinon on affiche une erreur
                this.display.display(err).then();
              });
          }
        })
        .catch(err => {
          this.recupListe().then();
        });
    }
  }

  // récupère la liste des résidences pour l'afficher dans la partie résidence
  async recupListe() {
    await lastValueFrom(this.httpService.getListe())
      .then((results: ListeModel) => {
        this.liste = results;
      })
      .catch(err => {
        this.router.navigate(['/erreur']).then();
      });
  }

  // permet d'afficher le mot de passe pour le mdp rp
  toggleMdp() {
    if (this.iconMdp.name === 'eye-outline') {
      this.iconMdp.name = 'eye-off-outline';
      this.inputMdp.type = 'password';
    } else {
      this.iconMdp.name = 'eye-outline';
      this.inputMdp.type = 'text';
    }
  }

  createRes() {
    this.display.alertWithInputs(
      'Mot de passe RP',
      [{
        name: 'mdp',
        type: 'text',
        placeholder: 'Mot de passe RP'
      }
      ]).then(result => {
      if (result.role !== 'cancel' && result.role !== 'backdrop') {
        lastValueFrom(this.httpService.checkMdpRp(result.data.values.mdp)).then()
          .catch(async err => {
            // si status = 200, alors le mot de passe est correct
            if (err.status === 200) {

              this.display.alertWithInputs(
                'Informations de la résidence',
                [{
                  name: 'name',
                  type: 'text',
                  placeholder: 'Nom de la résidence (exemple Saint-Omer)'
                }]
              ).then(res => {
                if (res.role !== 'cancel' && res.role !== 'backdrop') {
                  // on créé la res
                  lastValueFrom(this.httpService.createRes(this.findId(res.data.values.name), res.data.values.name)).then()
                    .catch(error => {
                      if (error.status === 200) {
                        this.display.display({code: 'Résidence enregistré', color: 'success'}).then();
                        this.ionViewWillEnter();
                      } else if (error.status === 201) {
                        this.display.display('Une erreur a eu lieu, vérifiez que la résidence n\'existe pas déjà');
                      } else {
                        this.router.navigate(['/erreur']).then();
                      }
                    });
                }
              });

            } else if (err.status === 201) {
              this.display.display('Mot de passe incorrect').then();
            } else {
              this.router.navigate(['/erreur']).then();
            }
          });
      }
    });
  }

  findId(name) {
    return name.replace(/[^a-zA-Z]/gi, '').toLowerCase();
  }

  supprRes() {
    this.display.alertWithInputs(
      'Merci de demander au All de supprimer la résidence si besoin',
      [{
        name: 'mdp',
        type: 'text',
        placeholder: 'Mot de passe du ALL'
      }
      ]).then(result => {
      if (result.role !== 'cancel' && result.role !== 'backdrop') {
        lastValueFrom(this.httpService.checkMdpAll(result.data.values.mdp)).then()
          .catch(async err => {
            // si status = 200, alors le mot de passe est correct
            if (err.status === 200) {
              // on affiche la liste de résidence
              this.display.actionSheet(this.liste.residences, 'name', 'Choisissez la résidence à supprimer')
                .then(res => {
                  if (res !== 'cancel' && res !== 'backdrop') {
                    // on demande une confirmation avant de supprimer la résidence
                    this.display.alertWithInputs('Etes vous sur de vouloir supprimer la résidence ' + this.liste.residences[res].name + ' ?', [])
                      .then(resultat => {
                        if (resultat.role === 'ok') {
                          // on supprime la résidence
                          lastValueFrom(this.httpService.supprRes(this.liste.residences[res].residence, this.liste.residences[res].name)).then()
                            .catch(error => {
                              if (error.status === 200) {
                                this.display.display({code: 'Résidence supprimé', color: 'success'});
                                this.ionViewWillEnter();
                              } else {
                                this.display.display('Une erreur a eu lieu, merci de réessayer');
                              }
                            });
                        }
                      });
                  }
                });

            } else if (err.status === 201) {
              this.display.display('Mot de passe incorrect').then();
            } else {
              this.router.navigate(['/erreur']).then();
            }
          });
      }
    });
  }


  // événement pour rafraichir la page
  doRefresh(event) {
    setTimeout(() => {
      // permet de terminer l'animation
      event.target.complete();
      // rafraichi le json
      this.ionViewWillEnter();
    }, 1000);
  }
}
