import "./Element.css"
import {useState, useEffect, useRef} from 'react'
import DefaultForm from "./DefaultForm.jsx"

export default function Element(props){

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const menuRef = useRef(null);

    useEffect(() => {                                  // получаем данные с сервера
        fetch(`http://localhost:3001/${props.host}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error ("Ошибка получаения данных");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => console.error("Ошибка:", error));
    },[])

    function openMenu(){
        setIsOpen(prev => !prev);
    }

    useEffect(() => {                                 // обработчик клика вне меню

        function clickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            };
        }

        if (isOpen) {
            document.addEventListener("mousedown", clickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", clickOutside);
        }


    },[isOpen])


    function openForm() {
        props.onOpenForm(props.host);
    }

    function openPlan() {
        props.onOpenPlan();
    }


    return(
        <>
        <button className="button-element" onClick={openMenu}>{props.name}</button>

        {isOpen &&
            <div className="element-list" ref={menuRef}>
                <ul className="element-list-menu">
                    {data.map( element => (
                        <li key={element.id}><div className="element">{element.name}</div></li>
                    ))} 
                </ul>
                <button className="element-add" onClick={openForm}>ADD</button>
                {props.host === "groups" && <button className="button-plan" onClick={openPlan}>План класса</button>}
            </div>

        }
        </>
    )
}

