import {
  MatCheckboxModule,
  MatListModule,
  MatSidenavModule,
} from '@angular/material';

import { NgModule } from '@angular/core';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    MatCheckboxModule,
    MatListModule,
    MatSidenavModule,
  ]
})
export class DemoMaterialModule {}
