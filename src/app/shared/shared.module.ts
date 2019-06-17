import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

const modules = [
  MaterialModule,
  FlexLayoutModule,
  FormsModule,
  CommonModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class SharedModule {}
