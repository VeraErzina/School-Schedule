import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState} from 'react'


export default function DefaultForm(props){

    const [value, setValue] = useState();
    const [priorityValue, setPriorityValue] = useState();

    const list = {
        days: "день недели",
        classes: "кабинет",
        lessonslist: "урок"
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
            <AddButton host={props.host} name={value} priority={priorityValue} onUpdateList={props.onUpdateList} onCloseForm={props.onCloseForm}/>
        </div>
    )
}