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
export class CodeAreaComponent implements OnInit {

  constructor(private _router: ActivatedRoute, private router: Router){ }

  selectedLang: string;
  editorOptions: any;
  boilerPlateCode: any;
  term: Terminal;
  fitAddon: FitAddon;
  runBtnDisable: boolean = true;
  socket = io("http://localhost:3000")

  baseTerminalOptions: ITerminalOptions = {
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorBlink: true,
    convertEol: true,
    theme: { background: '#263238' },
    scrollback: Number.MAX_SAFE_INTEGER,
  };

  ngOnInit(){
    this._router.paramMap.subscribe(params => {
      this.selectedLang = params.get('lang');
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

    this.term.onKey(e => {
      console.log(e.key);
      this.term.write(e.key);
      if (e.key == '\r')
          this.term.write('\n');
    })

    this.term.onData((input) => {
      this.socket.send('userInput', input);
    })

    this.socket.on("connect", () => {
      console.log("Connected with ID: ", this.socket.id);
    })

  }

  goToHome(){
    this.router.navigate(['/']);
    this.socket.disconnect()
  }

  runCode(){
    this.term.reset();
    console.log(this.boilerPlateCode);

    const runBtnDiv = document.getElementById('runBtn');
    runBtnDiv.style.pointerEvents = 'none'; // Disable clicks
    setTimeout(() => {
      runBtnDiv.style.pointerEvents = 'auto'; // Enable clicks
    }, 1000);

    this.socket.emit("run-code", this.boilerPlateCode, this.selectedLang == "C++"? "cpp" : this.selectedLang.toLowerCase());

    this.socket.on("output-from-server", (output) => {    
      this.term.write(output)
      this.socket.removeAllListeners();
    })
  }

}
