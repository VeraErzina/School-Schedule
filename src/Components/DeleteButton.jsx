import "./Form.css"

export default function DeleteButton(props){

    function deleteData(e, id){
        e.preventDefault();

        fetch(`http://localhost:8080/lesssched/${props.host}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при удалении");
            }
            console.log(`Элемент с id ${id} удален`);
        })
        .catch((error) => console.error("Ошибка:", error))
    }


    return(
        <button className="delete-button" type="button" onClick={deleteData}>Удалить</button>
    )
}