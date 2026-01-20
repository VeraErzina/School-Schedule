import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function GroupsForm(props){
    const [value, setValue] = useState();
    const [selectedPlan, setSelectedPlan] = useState();    
    const [plan, setPlan] = useState([]);                             
    const toEdit = props.toEdit || null;

    useEffect(() => {
        if (toEdit) {
            setValue(toEdit.name || "");
            setSelectedPlan(toEdit.planID || "");
        } else {
            setValue("");
            setSelectedPlan("");
        }
    }, [toEdit]);

    useEffect(() => {
        fetch('http://localhost:8080/lesssched/planes')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setPlan(data))
        .catch(err => console.error(err));
    }, []); 

    function deleteData(id){

        fetch(`http://localhost:8080/lesssched/groups/${id}`, {
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


    return(
        <div className="form form-groups" ref={props.formRef}>
            <p className="p-groups">Введите класс:</p>
            <input
                className="name"
                type="text"
                required
                placeholder="5А"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <p className="p-group-lessonplan">Выберите план обучения:</p>
            <select 
                className="select-planlesson" 
                value={selectedPlan} 
                onChange={(e) => setSelectedPlan(e.target.value)}
            >
                <option value="">Выберите план</option>
                {plan.map(p => (
                    <option key={p.id} value={p.id}>
                    {p.name}
                </option>
                ))}
            </select> 

            <AddButton 
                {...(toEdit?.id && { id: toEdit.id })}
                host={props.host} 
                name={value} 
                planes = {selectedPlan}
                onUpdateList={props.onUpdateList} 
                onCloseForm={props.onCloseForm}
                toEdit={toEdit}/>

            {toEdit && (
                <button type="button" className="delete-button" onClick={()=>{deleteData(toEdit.id)}}>
                    Удалить класс
                </button>
            )}

            <button type="button" onClick={props.onCloseForm} className="close-button">
                &#x2715;
            </button>
        </div>
    )
}