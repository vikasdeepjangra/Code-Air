const http = require('http');
var express = require('express')
var cors = require('cors');  
const fs = require('fs');
const exec  = require('child_process').exec;
const os = require('os');
const pty = require('node-pty');
const shell = os.platform() === 'win32' ? 'powershell.exe' : '/bin/bash';

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cwd: process.cwd(),
  env: process.env
});

const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:4200']
  }
})

//COPY CODE FROM CODE EDITOR TO A TEMP FILE FOR COMPILATION
async function createTempFile(code, language) {
  console.log("Temp File Created!");
  const ext = language == "python" ? "py" : language;
  return new Promise((resolve, reject) => {
    fs.writeFile(`tempFile/temp.${ext}`, code, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("File created successfully!");
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

//RUN API TO CREATE THE a.out FILE 
async function compile(language){
  console.log("Compilation Done!");
  return new Promise((resolve, reject) => {
    const command = "g++ temp.cpp";
    exec(`cd tempFile && ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      resolve("File Compile Successfully");
  });
  })
}

//RUN API TO RUN THE a.out FILE IN BACKEND
//USE PTY-PROCESS HERE INSTEAD OF EXEC DIRECTLY
async function run(){
  console.log("Running...");
  return new Promise((resolve, reject) => {
    exec('cd tempFile && ./a.out', function(err, data) {
      if(err){
        reject(err.toString())
      }
      console.log(data.toString());
      resolve(data.toString());                    
    });
  })
}

//SOCKET CONNECTION 
//CREATE TEMP FILE, COMPILE AND RUN THE CODE.
io.on('connection', socket => {
  console.log(socket.id);

  socket.on('run-code', async (code, language) => {
    //To Create Temp File
    try {
      const res = await createTempFile(code, language);
      const compileRes = await compile(language);
      const runRes = await run();
      socket.emit("output-from-server", runRes) 
    } catch (error) {
      var resErr = error.toString()
      var lines = resErr.split('\n');
      lines.splice(0,1);
      resErr = lines.join('\n');
      socket.emit("output-from-server", resErr) 
    }

  })

})