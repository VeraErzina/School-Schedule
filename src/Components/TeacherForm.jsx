import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function TeacherForm(props){

    const [lessons, setLessons] = useState([]);
    const [classes, setClasses] = useState([]);
    const [day, setDay] = useState([]);
    const [value, setValue] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [disciplines, setDisciplines] = useState([
         { lesson: "", hours: "", classes: "" }
    ]);
    const toEdit = props.toEdit || null;

    useEffect(() => {
        if (toEdit) {
            setValue(toEdit.name || "");
            setSelectedDay(toEdit.methodicalDay || "");
            setDisciplines(toEdit.discipline.length > 0 
                ? toEdit.discipline 
                : [{ lesson: "", hours: "", classes: "" }]
            );
        } else {
            setValue("");
            setSelectedDay("");
            setDisciplines([{ lesson: "", hours: "", classes: "" }]);
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
        fetch('http://localhost:3001/classes')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setClasses(data))
        .catch(err => console.error(err));
    }, []); 
    
    useEffect(() => {
        fetch('http://localhost:3001/days')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setDay(data))
        .catch(err => console.error(err));
    }, []);

    function handleDisciplineChange(index, field, value) {
        const updated = [...disciplines];
        updated[index][field] = value;
        console.log(updated);
        setDisciplines(updated);
    }

    function addDiscipline() {
        console.log("Добавление новой дисциплины"); 
        setDisciplines([...disciplines, { lesson: "", hours: "", classes: "" }]);
    }

    function deleteData(id){

        fetch(`http://localhost:3001/teachers/${id}`, {
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
        <div className="form form-teacher">
            <p>Введите ФИО учителя:</p>
            <input
                className="name"
                type="text"
                required
                placeholder="хуй учителя"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <p className="p-day">Методический день:</p>
            <select 
                className="select-day" 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
            >
                <option value="" disabled>Выберите методический день</option>
                {day.map(day => (
                    <option key={day.id} value={day.id}>
                    {day.name}
                </option>
                ))}
            </select> 

            {disciplines.map((disc, index) => (
                <div key={index} className="discipline-block">
                    <p className="p-discipline">Дисциплина:</p>
                    <select
                        className="select-discipline"
                        value={disc.lesson}
                        onChange={(e) => handleDisciplineChange(index, "lesson", e.target.value)}
                        required
                    >
                        <option value="" disabled>Выберите дисциплину</option>
                        {lessons.map(lesson => (
                            <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
                        ))}
                    </select>

                    <p className="p-hours">Кол-во часов:</p>
                    <input
                        className="input-hours"
                        type="text"
                        placeholder="Количество часов"
                        value={disc.hours}
                        onChange={(e) => handleDisciplineChange(index, "hours", e.target.value)}
                    />

                    <p>Кабинет:</p>
                    <select
                        className="select-class"
                        value={disc.classes}
                        onChange={(e) => handleDisciplineChange(index, "classes", e.target.value)}
                    >
                        <option value="">Выберите кабинет</option>
                        {classes.map(classes => (
                            <option key={classes.id} value={classes.id}>{classes.name}</option>
                        ))}
                    </select>
                </div>
            ))}

            <button className="add-discipline" type="button" onClick={addDiscipline}>добавить еще дисциплину</button>

            
            <AddButton 
                host={props.host} 
                name={value} 
                methodical={selectedDay} 
                disciplines={disciplines}
                onUpdateList={props.onUpdateList} 
                onCloseForm={props.onCloseForm}
                toEdit={toEdit}/>

            {toEdit && (
                <button type="button" className="delete-button" onClick={()=>{deleteData(toEdit.id)}}>
                    Удалить учителя
                </button>
            )}

            <button type="button" onClick={props.onCloseForm} className="close-button">
                &#x2715;
            </button>
        </div>
    )
}