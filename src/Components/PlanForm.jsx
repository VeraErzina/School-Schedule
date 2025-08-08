import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function PlanForm(props){
    const [selectedLesson, setSelectedLesson] = useState([]);
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const toEdit = props.toEdit || null;

    function handleCheckboxChange(e) {
        const id = e.target.value;
        setSelectedLesson(prev =>
            prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    }

    const selectedNames = data
        .filter(item => selectedLesson.includes(String(item.id)))
        .map(item => item.name);



    useEffect(() => {
        if (toEdit) {
            setValue(toEdit.name || "");
            setSelectedLesson(toEdit.lessons || "");
        } else {
            setValue("");
            setSelectedLesson("");
        }
    }, [toEdit]);



    useEffect(() => {                                  
        fetch(`http://localhost:3001/lessonslist`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error ("Ошибка получаения данных");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => console.error("Ошибка:", error));
        },[])


    function deleteData(id){

        fetch(`http://localhost:3001/lessonsplan/${id}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при удалении");
            }
            
        })
        .then(() => {
            console.log(`Элемент с id ${id} удален`);
            props.onUpdateList();  
            props.onCloseForm(); 
        })
        .catch((error) => console.error("Ошибка:", error))
    }

    return (
    <div className="form">
        <p className="p-planname">Название плана</p>
        <input
            type="text"
            className="input-plan"
            required
            placeholder="название"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        <div className="lessonplan">
            {data.map((item) => (
                <label key={item.id}>
                <input
                    type="checkbox"
                    value={item.id}
                    checked={selectedLesson.includes(item.id)}
                    onChange={handleCheckboxChange}
                />
                {item.name}
                </label>
            ))}
        </div>

        <p className="p-lessonsplan">Выбрано: {selectedNames.join(", ")}</p>

        <AddButton 
            onUpdateList={props.onUpdateList} 
            onCloseForm={props.onCloseForm}
            host={props.host}
            name={value}
            lessons={selectedLesson}
        />

        {toEdit && (
            <button type="button" className="delete-button" onClick={()=>{deleteData(toEdit.id)}}>
                Удалить план
            </button>
            )}

            <button type="button" onClick={props.onCloseForm} className="close-button">
                &#x2715;
            </button>
    </div>
  )
}