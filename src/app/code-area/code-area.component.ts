import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import boilerplate from "../../assets/boilerplateCodes.json";

@Component({
  selector: 'app-code-area',
  templateUrl: './code-area.component.html',
  styleUrls: ['./code-area.component.css']
})
export class CodeAreaComponent {

  constructor(private _router: ActivatedRoute, private router: Router){ }

  selectedLang: string;
  editorOptions: any;
  boilerPlateCode: any;

  ngOnInit(){
    this._router.paramMap.subscribe(params => {
      this.selectedLang = params.get('lang');
      console.log(this.selectedLang);
    });

    for(let i=0; i<boilerplate.length; i++){
      if(boilerplate[i].language == this.selectedLang){
        this.boilerPlateCode = boilerplate[i].boilerPlateCode;
      }
    }

    this.editorOptions = {theme: 'vs-dark', 
                          language: this.selectedLang == "C++"? "cpp" : this.selectedLang.toLowerCase(), 
                          renderIndentGuides: true, 
                          fontSize: "15px",
                          wordWrap: "off"  };
                      
  }

  goToHome(){
    this.router.navigate(['/']);
  }

}
