import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'


export default function DefaultForm(props){

    const [value, setValue] = useState();
    const [priorityValue, setPriorityValue] = useState();
    const toEdit = props.toEdit || null;

    const list = {
        days: "день недели",
        classes: "кабинет",
        lessonslist: "урок"
    }

    useEffect(() => {
            if (toEdit) {
                setValue(toEdit.name || "");
                if (toEdit.priopity){
                setPriorityValue(toEdit.priority || "");
                }
            } else {
                setValue("");
                }
        }, [toEdit]);


    function deleteData(data){
        console.log("deleteData вызвано с данными:", data);
        fetch(`http://localhost:3001/${props.host}/${data.id}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при удалении");
            }
                
        })
        .then(() => {
            console.log(`Элемент с id ${data.id} удален`);
            props.onUpdateList();  
            props.onCloseForm(); 
        })
        .catch((error) => console.error("Ошибка:", error))
    }
    

    return(
        <div className="form form-default">
            <p>Введите {list[props.host]}:</p>
            <input
                type="text"
                required
                placeholder="хуй"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {props.host == "lessonslist" &&
                <>
                <p className="p-priority">Приоритет предмета:</p>
                <input
                    className="priority"
                    type="text"
                    placeholder="введите число"
                    value={priorityValue}
                    onChange={(e) => setPriorityValue(e.target.value)}
                /></>
            }
            <AddButton 
                host={props.host} 
                name={value} 
                priority={priorityValue} 
                onUpdateList={props.onUpdateList} 
                onCloseForm={props.onCloseForm}
                toEdit={toEdit}/>

            {toEdit && (
                <button type="button" className="delete-button" onClick={()=>{deleteData(toEdit)}}>
                    Удалить {list[props.host]}
                </button>
            )}

            <button type="button" onClick={props.onCloseForm} className="close-button">
                &#x2715;
            </button>

        </div>
    )
}