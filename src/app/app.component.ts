import { Component, OnInit } from '@angular/core';
import supportedLanguages from '../assets/supportedLanguages.json'
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  supportedLang: any[] = supportedLanguages;
  selectedLang: string;
  showOptions: boolean = true;

  constructor(private _router: Router){
    _router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        if(val.url == "/"){
          this.showOptions = true;
        }
        else{
          this.showOptions = false;
        }
      }
    });
  }
  ngOnInit(): void {
    console.log(this.supportedLang)
  }

}
