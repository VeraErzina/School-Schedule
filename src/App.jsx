import './App.css'
import Menu from './Components/Menu.jsx'

function App() {
  return(
    <>
    <Menu/>
    </>
  )
}

export default App


/* npm install -g json-server / json-server --version / json-server --watch db.json --port 3001*/

  /*"main": "main.js",*/
    /*"electron": "electron ."*/

    /*"build": {
    "appId": "com.example.myapp",
    "win": {
          "target": "nsis",
          "desktop": {
            "createDesktopShortcut": false
          }
        }
    "productName": "MyReactApp",
    "directories": {
      "buildResources": "public"
    },
    "files": [
      "dist/**//*",
      "main.js",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    }
  }
    
  "type": "commonjs",
  
  npm run electron-dev // запускает vite сервер (localhost:5173) ждёт, пока он запустится, открывает Electron окно с живым React-приложением
  npm run electron-pack // vite build — пересобирает React-приложение в dist, electron-builder build --win — создаёт установщик .exe с новым кодом
  
  */

 