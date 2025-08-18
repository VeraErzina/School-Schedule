import "./Menu.css"

export default function StopServer(){
    function stop(){
        fetch("http://localhost:8080/lesssched/shutdown")
          .then(response => {
            if(!response.ok) {
              throw new Error("Ошибка остановки!")
            }
              return response.json();
          })
          .catch(error => {
            console.error("Ошибка остановки сервера:", error.message);
          })
    }   

    return(
        <div className="stop" onClick={() => stop()}>Остановить сервер</div>
    )
}