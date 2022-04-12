import { LOCALE_ID, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatetimepickerModule, MatNativeDatetimeModule, MAT_DATETIME_FORMATS  } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatTabsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    ScrollingModule,
    MatBadgeModule,
    MatMomentDateModule,
    MatDatetimepickerModule,
   /*  MatNativeDatetimeModule, */
    MatMomentDatetimeModule
  ],
  exports: [
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatTabsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    ScrollingModule,
    MatBadgeModule,
    MatMomentDateModule,
    MatDatetimepickerModule,
    /* MatNativeDatetimeModule, */
    MatMomentDatetimeModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    /* { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    }, */
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    /* { provide: MAT_DATETIME_FORMATS, useValue:  MAT_MOMENT_DATE_ADAPTER_OPTIONS }, */
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
})
export class AngularMaterialModule {}
