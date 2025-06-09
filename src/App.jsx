import './App.css'
import Button from './Components/Button.jsx'

import Start from './Components/Start.jsx'


function App() {
  return(
    <>
    <header>
    <Button name="Учителя" type="teachers" index="0"/>
    <Button name="Кабинеты" type="classroom" index="1"/>
    <Button name="Классы" type="classes" index="2"/> 
    </header>
    <Start/>
    </>
  )
}

export default App


/* npm install -g json-server / json-server --version / json-server --watch db.json --port 3001*/

 