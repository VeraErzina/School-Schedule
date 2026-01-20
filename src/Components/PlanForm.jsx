import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function PlanForm(props){

    const [data, setData] = useState([]);
    const [value, setValue] = useState("");
    const [grade, setGrade] = useState("");
    const [planelements, setPlanelements] = useState(
        Array.from({ length: 15 }, () => ({ discipline: "", hours: "" }))
    );
    const toEdit = props.toEdit || null;

    useEffect(() => {
        console.log(toEdit);
        async function editData(planID) {
            try {
                const response = await fetch(`http://localhost:8080/lesssched/planelements/${planID}`);
                if (!response.ok) {
                throw new Error("Ошибка получения данных плана");
                }

            const data = await response.json();

            const loadedDisciplines = data.map((item) => ({
            id: item.id,
            discipline: item.disciplineID || "",
            hours: item.hours || ""
            }));

            setPlanelements(() => {
                const updated = Array.from({ length: 15 }, (_, i) => (
                loadedDisciplines[i] || { discipline: "", hours: "" }
                ));
                return updated;
            });

            console.log("Данные дисциплин загружены:", loadedDisciplines);
            } catch (error) {
            console.error("Ошибка при загрузке данных дисциплин:", error);
            }
        }

        if (toEdit) {
            setValue(toEdit.name || "");
            setGrade(toEdit.grade || "");
        if (Array.isArray(toEdit.plan) && toEdit.plan.length > 0) {
            editData(toEdit.id);
        }
        } else {
            setValue("");
            setGrade("");
        }
    }, [toEdit]);



    useEffect(() => {                                  
        fetch(`http://localhost:8080/lesssched/disciplines`)
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

        fetch(`http://localhost:8080/lesssched/planes/${id}`, {
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

    function handleChange(index, field, value) {
        const updated = [...planelements];
        updated[index][field] = value;
        setPlanelements(updated);
        console.log(planelements);
    }

    return (
    <div className="form form-plan" ref={props.formRef}>
        <p className="p-planname">Название плана</p>
        <input
            type="text"
            className="input-plan"
            required
            placeholder="5-9 классы"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        <p className="p-grade">Максимальное количество уроков в день:</p>
        <input
            type="number"
            className="input-grade"
            required
            placeholder="6"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
        />
         {planelements.map((block, index) => (
            <div key={index} className={`discipline-block block-${index}`}>
            <p className="p-discipline">Дисциплина:</p>
            <select
                className="select-discipline"
                value={block.discipline}
                onChange={(e) => {
                    handleChange(index, "discipline", e.target.value)
                }}
                required
            >
                <option value="" disabled>Выберите дисциплину</option>
                {data.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            </select>

            <p className="p-hours">Кол-во часов:</p>
            <input
            type="number"
            min="1"
            className="input-hours"
            value={block.hours || ""}
            onChange={(e) => {
                const updated = [...planelements];
                updated[index].hours = e.target.value === "" ? "" : parseInt(e.target.value);
                setPlanelements(updated);
            }}
            placeholder="Количество часов"
            required
            />
            </div>
        ))}

        <AddButton 
            {...(toEdit?.id && { id: toEdit.id })}
            onUpdateList={props.onUpdateList}
            onCloseForm={props.onCloseForm}
            host={props.host}
            name={value}
            grade={grade}
            planelements={planelements} // [{id, hours}]
            toEdit={toEdit}
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