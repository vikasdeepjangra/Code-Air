import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeAreaComponent } from './code-area/code-area.component';

const routes: Routes = [
  {path: "codeArea/:lang", component: CodeAreaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const routingComponent = [CodeAreaComponent]
