import "./Element.css"
import {useState, useEffect, useRef} from 'react'

export default function Element(props){

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const menuRef = useRef(null);



    function getData() {                                  // получаем данные с сервера
        fetch(`http://localhost:8080/lesssched/${props.host}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error ("Ошибка получаения данных");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => console.error("Ошибка:", error));
    }

    useEffect(() => {
        getData();
    },[props.refreshKey])

    function openMenu(){
        setIsOpen(prev => !prev);
    }

    useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideMenu =
        menuRef.current && !menuRef.current.contains(event.target);
      const clickedOutsideForm =
        !props.formRef?.current || !props.formRef.current.contains(event.target);

      // Закрываем меню, если кликнули вне меню и вне формы
      if (clickedOutsideMenu && clickedOutsideForm) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, props.formRef]);


    return(
        <>
        <button className="button-element" onClick={openMenu}>{props.name}</button>

        {isOpen &&
            <div className="element-list" ref={menuRef}>
                <ul className="element-list-menu">
                    {data.map( element => (
                        <li key={element.id}><div className="element" onClick={() => props.onOpenForm(props.host, element)}>{element.name}</div></li>
                    ))} 
                </ul>
                <button className="element-add"  onClick={() => props.onOpenForm(props.host, null)}>ADD</button>
            </div>

        }
        </>
    )
}

