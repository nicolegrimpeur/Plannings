import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import {Display} from '../shared/class/display';
import {User} from '../shared/class/user';
import {HttpService} from '../core/http.service';
import {ListeModel} from '../shared/models/liste.model';

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
    private user: User,
    public httpService: HttpService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.recupListe().then();
  }

  // corrige le mail si besoin
  checkMail() {
    while (this.loginData.mail.indexOf(' ') !== -1) {
      this.loginData.mail = this.loginData.mail.replace(' ', '-');
    }
  }

  // connecte l'utilisateur avec email et mot de passe
  login() {
    this.loginData.mail =
      this.loginData.nom + '+' +
      this.loginData.prenom + '+' +
      this.loginData.residence + '+' +
      this.loginData.chambre + '+' +
      ((this.loginData.mdpRp === 'Hell0Rps') ? 'true' : 'false') +
      '+planning@all.fr';

    this.checkMail();

    // si le mot de passe est incorrect on bloque la connexion
    this.httpService.checkMdpRp(this.loginData.mdpRp).toPromise().then().catch(result => {
      if (result.status !== 200) {
        this.display.display('Mauvais mot de passe').then();
        this.loginData.mdpRp = '';
      } else {
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
    });
  }

  // récupère la liste des résidences pour l'afficher dans la partie résidence
  async recupListe() {
    await this.httpService.getListe().toPromise()
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
    }
    else {
      this.iconMdp.name = 'eye-outline';
      this.inputMdp.type = 'text';
    }
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
