import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import boilerplate from "../../assets/boilerplateCodes.json";
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Socket, io } from 'socket.io-client'

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
  term: Terminal;
  fitAddon: FitAddon;
  socket = io("http://localhost:3000")

  baseTerminalOptions: ITerminalOptions = {
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorBlink: true,
    theme: { background: '#263238' },
    scrollback: Number.MAX_SAFE_INTEGER,
  };

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
                      
    this.term = new Terminal(this.baseTerminalOptions);
    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);       
    this.term.open(document.getElementById('terminal'));
    this.term.write("Click on Run.")
    this.fitAddon.fit();

    this.socket.on("connect", () => {
      console.log("Connected with ID: ", this.socket.id);
    })

  }

  goToHome(){
    this.router.navigate(['/']);
  }

  runCode(){
    console.log(this.boilerPlateCode);
    this.socket.emit("run-code", this.boilerPlateCode);
  }


}
