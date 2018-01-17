import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';


import {DemoMaterialModule} from './demo.module';
import { AppComponent } from './app.component';
import { DashboardAppComponent } from './dashboard-app/dashboard-app.component';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';
import {environment} from './environment';

export const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/aio/master', pathMatch: 'full'},
  {path: ':project/:branch', component: DashboardAppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardAppComponent,
    DashboardChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    RouterModule.forRoot(APP_ROUTES),
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

