import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
