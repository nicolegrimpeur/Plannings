import { Component, OnInit } from '@angular/core';
import {User} from '../shared/class/user';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.page.html',
  styleUrls: ['./liste.page.scss'],
})
export class ListePage implements OnInit {

  constructor(
    public user: User
  ) { }

  ngOnInit() {
  }

}
