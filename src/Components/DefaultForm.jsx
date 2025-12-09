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
        disciplines: "урок"
    }

    useEffect(() => {
            if (toEdit) {
                setValue(toEdit.name || "");
                if (toEdit.priority){
                setPriorityValue(toEdit.priority || "");
                }
                if (toEdit.maxLessons){
                setPriorityValue(toEdit.maxLessons || "");
                }
            } else {
                setValue("");
                }
        }, [toEdit]);


    function deleteData(data){
        console.log("deleteData вызвано с данными:", data);
        fetch(`http://localhost:8080/lesssched/${props.host}/${data.id}`, {
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
        <div className="form form-default" ref={props.formRef}>
            <p>Введите {list[props.host]}:</p>
            <input
                type="text"
                required
                placeholder=""
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {props.host == "disciplines" &&
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
            {props.host == "days" &&
                <>
                <p className="p-priority">Кол-во уроков:</p>
                <input
                    className="priority"
                    type="text"
                    placeholder="введите число"
                    value={priorityValue}
                    onChange={(e) => setPriorityValue(e.target.value)}
                /></>
            }
            <AddButton                   
                {...(toEdit?.id && { id: toEdit.id })}
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