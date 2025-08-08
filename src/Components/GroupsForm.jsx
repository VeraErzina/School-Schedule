import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function GroupsForm(props){
    const [value, setValue] = useState();
    const [selectedPlan, setSelectedPlan] = useState();
    const [selectedLesson, setSelectedLesson] = useState();
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);                                      

    const [teachers, setTeachers] = useState([]);
    const [plan, setPlan] = useState([]);
    const [lessons, setLessons] = useState([]);
    const toEdit = props.toEdit || null;

    useEffect(() => {
        if (toEdit) {
            setValue(toEdit.name || "");
            setSelectedPlan(toEdit.lessonsplan || "");
        } else {
            setValue("");
            setSelectedPlan("");
        }
    }, [toEdit]);

    useEffect(() => {
        fetch('http://localhost:3001/lessonslist')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setLessons(data))
        .catch(err => console.error(err));
    }, []); 
    
    useEffect(() => {
        fetch('http://localhost:3001/teachers')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setTeachers(data))
        .catch(err => console.error(err));
    }, []); 

    useEffect(() => {
        fetch('http://localhost:3001/lessonsplan')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setPlan(data))
        .catch(err => console.error(err));
    }, []); 

    function handleCheckboxChange(e) {
        const id = e.target.value;
        setSelectedTeachers(prev =>
            prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    }

    function addGroup() {
        if (!selectedLesson || selectedTeachers.length === 0) return;

        const newGroup = {
            lesson: selectedLesson,
            teacher: [...selectedTeachers]
        };

        setSelectedGroup(prev => [...prev, newGroup]);
        setSelectedLesson("");
        setSelectedTeachers([]);
    }

    function deleteData(id){

        fetch(`http://localhost:3001/groups/${id}`, {
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
        <div className="form form-groups">
            <p className="p-groups">Введите класс:</p>
            <input
                className="name"
                type="text"
                required
                placeholder="хуй класса"
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

            <p className="p-pair">Введите учителя/ей и предмет, которые ведут в этом классе</p>

            <p className="p-group-lesson">Предмет:</p>
            <select 
                className="select-lesson" 
                value={selectedLesson} 
                onChange={(e) => setSelectedLesson(e.target.value)}
            >
                <option value="">Выберите предмет</option>
                {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                </option>
                ))}
            </select> 
            {selectedLesson && (
            <>
            <p className="p-group-teacher">Учитель либо группа учителей:</p>
                <div className="checkbox-groups">
                {teachers
                    .filter(teacher =>
                        Array.isArray(teacher.discipline) &&
                        teacher.discipline.some(d => d.lesson === selectedLesson)
                        )
                    .map((item) => (
                        <label key={item.id}>
                        <input
                            type="checkbox"
                            value={item.id}
                            checked={selectedTeachers.includes(item.id)}
                            onChange={handleCheckboxChange}
                        />
                        {item.name}
                        </label>
                    ))
                }
                </div>
            </>
            )}

            <button type="button" className="groups-button" onClick={addGroup}>Добавить предмет и учителя</button>

            <AddButton 
                host={props.host} 
                name={value} 
                lessonsplan = {selectedPlan}
                lessonspair = {selectedGroup}
                onUpdateList={props.onUpdateList} 
                onCloseForm={props.onCloseForm}/>

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