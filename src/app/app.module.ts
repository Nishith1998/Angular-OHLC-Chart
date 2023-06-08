import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { TickersTableComponent } from './tickers-table/tickers-table.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { LayoutComponent } from './layout/layout.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingInterceptor } from './services/loading-interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OverlayModule } from '@angular/cdk/overlay';

class MyErrorHandler implements ErrorHandler {
  handleError() {
    // do something with the exception
    // console.log("error:", error)
  }
}


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    TickersTableComponent,
    OrderBookComponent,
    LayoutComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    OverlayModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  },
  { provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
