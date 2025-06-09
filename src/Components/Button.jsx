import "./Button.css"
import {useState, useEffect} from 'react'
import { VscChromeClose } from "react-icons/vsc";
import { VscAttach } from "react-icons/vsc";

export default function Button({name, type, index}){

    const [active, setActive] = useState(false);
    const [data, setData] = useState([]);
    const [value, setValue] = useState("");
    const [pairId, setPairId] = useState(null);
    
    const placeholderText = ['Иванова Елена Вячеславовна 30', '404', '3А']
 
    function handleKeyDown(event){                          /*ОТПРАВЛЯЕМ НОВЫЙ ОБЪЕКТ НА СЕРВЕР И ОБНОВЛЯЕМ СПИСОК*/
        if (event.key === 'Enter'){
            const newData = addNewData(value, type)
            fetch(`http://localhost:3001/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка сервера");
                }
                return response.json();
            })
            .then( () => {
                setValue("");
                getData();
            })
            .catch(error => console.error("Ошибка при отправке:", error))           
        }
    }


    function addNewData(value, type) {                       /*СОЗДАЕМ НОВЫЙ ОБЪЕКТ В СПИСКЕ*/
        if (type == "teachers") {
            let arr = value.trim().split(" ")
            let hours = Number(arr.pop())
            return {
                /*id: 0,*/
                name: arr.join(" "),
                maxHours: hours,
                pair: false
            }
        }
        else {
            return {
                /*id: 0,*/
                name: value
            }
        }
        
    }


    useEffect( ()=> {
        getData()
    },[])


    function getData(){                                        /*ПОЛУЧЕНИЕ ДАННЫХ С СЕРВЕРА*/ 
        fetch(`http://localhost:3001/${type}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Сервер вернул Ошибку!");
        }
        return response.json();
        })
        .then((data) => setData(data))
        .catch(error => console.error("Ошибка:", error.message))
    }


    function deleteData(id, type) {                              /*УДАЛЕНИЕ ЭЛЕМЕНТА*/
        fetch(`http://localhost:3001/${type}/${id}`, {
        method: "DELETE"    
    })
        .then(response => {
            if (!response.ok){
                throw new Error ("Mistake")
            }
            return response.json();
        })
        .then( () => {
            getData();    
        })
        .catch(error =>{
            console.error("Mistake", error);    
        })
    }


    function createPair(id){
  
        if (pairId !== null && pairId !== id) {
            sendPairToServer(pairId, id);
            setPairId(null); // Сбросить выбор после создания пары
        } else {
        setPairId(id); // Устанавливаем первого выбранного
        }
    }


    function sendPairToServer(id1, id2){
        fetch(`http://localhost:3001/teachers/${id1}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id2),
        })
        .then(response => {
            if(!response.ok) throw new Error ("Ошибка создания пары");
            console.log("Пара создана");
        })
        .catch(error => console.error(error));
    }


    return(
        <div className='container'>
        <button onClick={() => setActive(!active)}>{name}</button>

        {active && (
            <ul className={`dropmenu ${active ? 'open' : ''}`}>
                {data.map((element) => (
                    <li key={element.id}>
                        <div className='element-dropmenu'>
                            <div className='card-dropmenu'>
                            {element.name}
                            {element.maxHours !== undefined && `, часов: ${element.maxHours}`}
                                <div>
                                    <button className='button-delete' onClick={() => deleteData(element.id, type)}><VscChromeClose /></button>
                                    {(type == "teachers") &&
                                    <button 
                                        className={pairId === element.id ? 'button-pair-true' : 'button-pair'}
                                        onClick={() => createPair(element.id)}>
                                        <VscAttach />
                                    </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
                <input 
                    className = 'input-dropmenu'
                    value = {value}
                    placeholder = {`Пример: ${placeholderText[index]}`}
                    onChange = {(e) => setValue(e.target.value)} 
                    onKeyDown={handleKeyDown}
                />
            </ul>
        )}
        </div>
    )
}
