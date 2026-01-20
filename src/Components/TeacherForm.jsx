import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function TeacherForm(props){

    const [disciplines, setDisciplines] = useState([]); // для выпадающего списка "Дисциплина"
    const [classes, setClasses] = useState([]); // для "Кабинет"
    const [groups, setGroups] = useState([]); // для "Класс"
    const [days, setDays] = useState([]);
    const [admin, setAdmin] = useState(false);

    const [value, setValue] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [teacherDisciplines, setTeacherDisciplines] = useState(
        Array.from({ length: 18 }, () => ({discipline: "", classroom: "", group: "", hours: "", subgroup: ""})
    ));

    const toEdit = props.toEdit || null;

    useEffect(() => {
        async function editData(teacherID) {
        try {
            const response = await fetch(`http://localhost:8080/lesssched/teachersplan/${teacherID}`);
            if (!response.ok) {
                throw new Error("Ошибка получения данных плана учителя");
            }

        // сервер возвращает массив объектов teachersplan
        const data = await response.json();

        // Преобразуем в формат для состояния
        const loadedDisciplines = data.map((item) => ({
        id: item.id,
        discipline: item.disciplineID || "",
        classroom: item.classroomID || "",
        group: item.groupID || "",
        hours: item.hours || "",
        subgroup: item.subgroup || ""
        }));

        // Обновляем состояние
        setTeacherDisciplines(() => {
            const updated = Array.from({ length: 18 }, (_, i) => (
            loadedDisciplines[i] || { discipline: "", classroom: "", group: "", hours: "", subgroup: ""}
            ));
            return updated;
        });
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
        }

        if (toEdit) {
            setValue(toEdit.name || "");
            setSelectedDay(toEdit.methodicalDay || "");
            setAdmin(toEdit.admin || false);
        if (Array.isArray(toEdit.plan) && toEdit.plan.length > 0) {
            editData(toEdit.id);
        }
        } else {
            setValue("");
            setSelectedDay("");
        }
    }, [toEdit]);


    useEffect(() => {
        fetch('http://localhost:8080/lesssched/disciplines')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setDisciplines(data))
        .catch(err => console.error(err));
    }, []); 

    useEffect(() => {
        fetch('http://localhost:8080/lesssched/classes')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setClasses(data))
        .catch(err => console.error(err));
    }, []); 
    
    useEffect(() => {
        fetch('http://localhost:8080/lesssched/days')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setDays(data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/lesssched/groups')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки дисциплин');
            return response.json();
        })
        .then(data => setGroups(data))
        .catch(err => console.error(err));
    }, []);

    function handleChange(index, field, value) {
        const updated = [...teacherDisciplines];
        updated[index][field] = value;
        setTeacherDisciplines(updated);
        console.log(teacherDisciplines);
    }



  // Добавляем новый блок дисциплины
    /*function addDiscipline() {
        setTeacherDisciplines([
        ...teacherDisciplines,
        { discipline: "", classroom: "", group: "", hours: "" },
        ]);
    }*/

    function deleteData(id){

        fetch(`http://localhost:8080/lesssched/teachers/${id}`, {
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
        <div className="form form-teacher" ref={props.formRef}>
            <p>Введите ФИО учителя:</p>
            <input
                className="name"
                type="text"
                required
                placeholder="Иванов И. И."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <p className="p-day">Методический день:</p>
            <select 
                className="select-day" 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
            >
                <option value="" >Выберите методический день</option>
                {days.map(day => (
                    <option key={day.id} value={day.id}>
                    {day.name}
                </option>
                ))}
            </select> 

            <div className="p-admin">
                <p>Завуч:</p>
                <label>
                    <input
                    className="checkbox-admin"
                    type="checkbox"
                    checked={admin}
                    onChange={() => setAdmin(!admin)}
                    />
                    Да
                </label>
            </div>

            {teacherDisciplines.map((block, index) => (
                <div key={index} className={`discipline-block block-${index}`}>
                <p className="p-discipline">Дисциплина:</p>
                <select
                className="select-discipline"
                value={block.discipline}
                onChange={(e) =>
                    handleChange(index, "discipline", e.target.value)
                }
                required
                >
                <option value="" disabled>
                Выберите дисциплину
                </option>
                {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                    {d.name}
                    </option>
                ))}
                </select>

                <p className="p-class">Класс:</p>
                <select
                    className="select-group"
                    value={block.group}
                    required
                    onChange={(e) =>
                        handleChange(index, "group", e.target.value)
                    }
                >   
                <option value="">Выберите класс</option>
                {groups.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                    {cl.name}
                    </option>
                ))}
                </select>

                <p className="p-hours">Кол-во часов:</p>
                <input
                    className="input-hours"
                    type="number"
                    placeholder="Количество часов"
                    required
                    value={block.hours}
                    onChange={(e) => handleChange(index, "hours", e.target.value)}
                />

                <p>Кабинет:</p>
                <select
                    className="select-classroom"
                    value={block.classroom}
                    onChange={(e) => handleChange(index, "classroom", e.target.value)}
                >
                <option value="">Выберите кабинет</option>
                {classes.map((cab) => (
                    <option key={cab.id} value={cab.id}>
                    {cab.name}
                    </option>
                ))}
                </select>

                <p className="p-subgroup">Кол-во подгрупп:</p>
                <input
                    className="input-subgroup"
                    type="number"
                    placeholder="введите число больше 1"
                    value={block.subgroup}
                    onChange={(e) => handleChange(index, "subgroup", e.target.value)}
                />
                </div>
            ))} 


            {/*<button className="add-discipline" type="button" onClick={addDiscipline}>добавить еще дисциплину</button>*/}

            
            <AddButton 
                {...(toEdit?.id && { id: toEdit.id })}
                host={props.host}
                name={value}
                methodical={selectedDay}
                teachersplan={teacherDisciplines}
                onUpdateList={props.onUpdateList}
                onCloseForm={props.onCloseForm}
                admin={admin}
                toEdit={toEdit}
            />

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