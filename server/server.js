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
  return new Promise((resolve, reject) => {
    const command = "g++ temp.cpp";
    exec(`cd tempFile && ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject();
      }
      if (stderr) {
        reject();
      }
      resolve("File Compile Successfully");
  });
  })
}

//RUN API TO RUN THE a.out FILE IN BACKEND
async function run(){
  return new Promise((resolve, reject) => {
    exec('cd tempFile && ./a.out', function(err, data) { 
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
      console.log(res);
    } catch (error) {
      console.error(error);
    }

    //To Compile
    try {
      const res = await compile(language);
      console.log(res);
    } catch (error) {
      console.error(error);
    }

    //To Run
    try {
      const res = await run();
      socket.emit("output-from-server", res) 
    } catch (error) {
      console.error(error);
    }

  })

})