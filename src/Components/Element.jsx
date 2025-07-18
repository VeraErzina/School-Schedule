import "./Element.css"
import {useState, useEffect} from 'react'

export default function Element(props){

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/${props}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error ("Ошибка получаения данных");
                }
                return response.json;
            })
            .then((data) => setData(data))
            .catch((error) => console.error("Ошибка:", error));
    },[])

    function openMenu(){
        setIsOpen(prev => !prev);
    }

    return(
        <>
        <button className="button-element" onClick={openMenu}>{props.name}</button>

        {isOpen &&
            <div className="element-list">
                <ul>
                    map.data()
                </ul>
            </div>
        }
        </>
    )
}