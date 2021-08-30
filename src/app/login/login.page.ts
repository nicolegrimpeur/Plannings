import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import {Display} from '../shared/class/display';
import {User} from '../shared/class/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // data utilisés pour la connexion
  public loginData = {
    nom: '',
    prenom: '',
    residence: '',
    chambre: '',
    isRp: 'false',
    mdpRp: '',
  };

  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public display: Display,
    private user: User
  ) {
  }

  ngOnInit() {
  }

  // connecte l'utilisateur avec email et mot de passe
  login() {
    const mail =
      this.loginData.nom + '+' +
      this.loginData.prenom + '+' +
      this.loginData.residence + '+' +
      this.loginData.chambre + '+' +
      ((this.loginData.mdpRp === 'Hell0Rps') ? 'true' : 'false') +
      '+planning@all.fr';

    const password = 'f355bcd8af0541b815c00eda1360a30024c2ae8bfc53ead1073bf29b7589cc64';

    this.afAuth.fetchSignInMethodsForEmail(mail)
      .then(res => {
        // on check si l'email est connecté ou non avec un provider
        if (res.length === 1) { // si le mail existe, on l'envoi sur la page de login
          this.afAuth.signInWithEmailAndPassword(mail, password)
            .then(auth => {
              this.router.navigateByUrl('/').then();
            })
            .catch(err => {
              this.display.display(err).then();
            });
        } else { // sinon on créé un compte
          this.afAuth.createUserWithEmailAndPassword(mail, password)
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
        this.display.display(err).then();
      });

  }
}
