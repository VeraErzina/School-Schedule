import "./Form.css"

export default function AddButton(props){
    const toEdit = props.toEdit;

    function createData(props){
        

        if (props.host == "classes" || props.host == "days") {
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
        else if (props.host == "lessonslist") {
            return {
                name: props.name,
                priority: props.priority
            }
        }
        else if (props.host == "groups") {
            return {
                name: props.name,
                lessonsplan: props.lessonsplan,
                lessonspair: props.lessonspair
            }
        }
        else if (props.host == "lessonsplan"){
           return {
                name: props.name,
                lessons: props.lessons
            }
        }
    }


    function sendToServer(e){
        const newData = createData(props);
        e.preventDefault();
        if (toEdit && toEdit.id) {                                                                            // Обновление — PUT или PATCH
            fetch(`http://localhost:3001/${toEdit.host}/${toEdit.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData),
            })
            .then(res => {
            if (!res.ok) throw new Error("Ошибка обновления учителя");
            return res.json();
            })
            .then(() => {
            alert("Данные учителя обновлены");
            props.onUpdateList();  
            props.onCloseForm();   
            })
            .catch(err => alert(err.message));
        }
        else {
            

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
            .then(() => {
            if (props.onCloseForm) {
                props.onCloseForm();
            }
            if (props.onUpdateList) props.onUpdateList();
            })
            .catch((error) => console.error("Ошибка:", error))
        }
    }


    return(
        <button className="add-button" type="button" onClick={sendToServer}>{toEdit ? "Сохранить изменения" : "Добавить"}</button>
    )
}