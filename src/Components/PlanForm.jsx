import "./Form.css"
import AddButton from "./AddButton.jsx"
import {useState, useEffect} from 'react'

export default function PlanForm(){
    const [selectedLesson, setSelectedLesson] = useState([]);
    const [data, setData] = useState([]);
    const [value, setValue] = useState();

    function handleChange(e) {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedLesson(values);
    }

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
        <select 
        className="lessonplan" 
        multiple 
        value={selectedLesson} 
        onChange={handleChange}
        >
        {data.map((data) => (
          <option key={data.id} value={data.id}>
            {data.name}
          </option>
        ))}
        </select>

        <p className="p-lessonsplan">Выбрано: {selectedLesson.join(", ")}</p>

        <AddButton/>
    </div>
  )
}