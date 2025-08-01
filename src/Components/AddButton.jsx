import "./Form.css"

export default function AddButton(props){

    function createData(props){

        if (props.host == "classes" || props.host == "lessonslist" || props.host == "days") {
            return {
                name: props.name
            }
        }
        else if (props.host == "teachers") {
            return {
                name: props.name,
                discipline: props.disciplines,
                methodicalDay: props.methodical
            }
        }
        else if (props.host == "lessonplans"){
           return {
                name: props.name,
                lessonsplan: props.lessonsplan
            }
        }
    }


    function sendToServer(e){
        e.preventDefault();

        const newData = createData(props);

        fetch(`http://localhost:3001/${props.host}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при добавлении");
            }
        })
        .then((data) => {
            console.log("Add success", data)
        })
        .catch((error) => console.error("Ошибка:", error))
    }


    return(
        <button className="add-button" type="button" onClick={sendToServer}>Сохранить</button>
    )
}