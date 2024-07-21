import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ScreenOrientation} from '@awesome-cordova-plugins/screen-orientation/ngx';

import {provideMatomo} from 'ngx-matomo-client';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
        AngularFireModule.initializeApp(environment.global.firebaseConfig), AngularFireAuthModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [ScreenOrientation, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideMatomo(environment.global.matomoConfig), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
