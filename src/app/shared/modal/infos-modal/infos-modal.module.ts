import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfosModalPageRoutingModule } from './infos-modal-routing.module';

import { InfosModalPage } from './infos-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfosModalPageRoutingModule
  ],
  declarations: [InfosModalPage]
})
export class InfosModalPageModule {}
