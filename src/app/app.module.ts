import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyCRGxxUH7bdcRhdlvtOlp7mSRlyhzUtBwI',
  authDomain: 'plannings-all.firebaseapp.com',
  projectId: 'plannings-all',
  storageBucket: 'plannings-all.appspot.com',
  messagingSenderId: '454546000348',
  appId: '1:454546000348:web:64346dca6e12e8bc0f6719',
  measurementId: 'G-03T4E8FM98'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}