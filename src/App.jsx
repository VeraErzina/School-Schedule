import './App.css'
import Button from './Components/Button.jsx'
import Start from './Components/Start.jsx'
import StopServer from './Components/StopServer.jsx'

function App() {
  return(
    <>
    <header>
    <Button name="Учителя" type="teachers" index="0"/>
    <Button name="Кабинеты" type="classes" index="1"/>
    <Button name="Классы" type="groups" index="2"/> 
    </header>
    <Start/>
    <StopServer/>
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
    
  "type": "commonjs",*/

 