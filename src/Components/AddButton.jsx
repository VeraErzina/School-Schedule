import "./Form.css"

export default function AddButton(props){
    const toEdit = props.toEdit;

    function changeToServer(e) {
      e.preventDefault(); // чтобы не перезагружалась страница при отправке формы

      if (!props.name?.trim()) {
        alert("Имя пустое!");
      return;
      }
        // Собираем все нужные данные из props
      const {
        admin,
        host,
        id,
        name,
        methodical,
        teachersplan,
        priority,
        planes,
        Grade,
        planelements,
      } = props;

      // Формируем тело запроса: включаем только непустые поля
      const body = {
        ...(admin && {admin}),
        ...(id && {id}),
        ...(name && { name }),
        ...(Grade && { Grade }),
        ...(methodical && { methodicalDay: methodical }),
        ...(priority && { priority }),
        ...(planes && { planID: planes })
      };

      console.log("PUT body:", body);
      console.log("URL:", `http://localhost:8080/lesssched/${host}/${id}`);

      fetch(`http://localhost:8080/lesssched/${host}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при обновлении данных");
        return res.json();
      })
      .then(data => {
        console.log("Данные обновлены:", data);

        if (host == "teachers") {

        // 🔹 Сохраняем каждый блок teachersplan и собираем их ID
          console.log("dataToSave:", teachersplan)

          const dataToSave = teachersplan
            .filter(
              (block) => block.discipline && block.group && block.classroom && block.hours
            )
            .map((block) => ({
              id: block.id,
              teacherID: id,
              disciplineID: parseInt(block.discipline),
              groupID: parseInt(block.group),
              classroomID: parseInt(block.classroom),
              hours: parseInt(block.hours),
              subgroup: parseInt(block.subgroup)
            }));

          console.log("dataToSave:", dataToSave)
            for (const plan of dataToSave) {
              if(plan.id){
              fetch(`http://localhost:8080/lesssched/teachersplan/${plan.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(plan)
              })
              .then(data => {
                console.log("Данные успешно отредактированны:", data)
              })}
              else {
                fetch("http://localhost:8080/lesssched/teachersplan", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(plan)
                })
                .then(data => {
                console.log("Данные успешно сохранены:", data)
                })
              }
          

          {/*for (const plan of teachersplan) {
            if (!plan.discipline) continue;
            if (plan.id){
            fetch(`http://localhost:8080/lesssched/teachersplan/${plan.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: plan.id,
              teacherID: id,
              disciplineID: parseInt(plan.discipline),
              groupID: parseInt(plan.group),
              classroomID: parseInt(plan.classroom),
              hours: parseInt(plan.hours),
              subgroup: parseInt(plan.subgroup) 
            })
            })
            .then(data => {
              console.log("Данные обновлены:", data);
            });
            }
            else {
            fetch("http://localhost:8080/lesssched/teachersplan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teacherID: id,
              disciplineID: parseInt(plan.discipline),
              groupID: parseInt(plan.group),
              classroomID: parseInt(plan.classroom),
              hours: parseInt(plan.hours),
              subgroup: parseInt(plan.subgroup)
            })
            })
            .then(data => {
              console.log("Данные teachersplan обновлены:", data);
            })
            }
          }
}*/}      }
        }
        if (host == "planes"){

          for (const el of planelements) {
            if (!el.discipline || !el.hours) continue; // пропускаем пустые блоки
            if (el.id) {
              fetch(`http://localhost:8080/lesssched/planelements/${el.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: el.id,
                planID: id,
                disciplineID: parseInt(el.discipline),
                hours: parseInt(el.hours)
              })
              })
              .then(data => {
                console.log("Данные обновлены:", data);
              });
            }
            else {
              fetch("http://localhost:8080/lesssched/planelements", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planID: id,
                disciplineID: parseInt(el.discipline),
                hours: parseInt(el.hours)
              })
              })
              .then(data => {
                console.log("Данные обновлены:", data);
              });
            }
          }
        }
        props.onUpdateList?.(); // если передана функция обновления списка
        props.onCloseForm?.();  // если передана функция закрытия формы
      })
      .catch(err => console.error("Ошибка PUT-запроса:", err));
    }




    async function sendToServer(e) {
    e.preventDefault();

    // Проверка: не пытаемся сохранить пустое имя
    if (!props.name?.trim()) {
      alert("Имя пустое!");
      return;
    }

    if (props.host == "teachers") {
      try {
      // 🔹 Создание учителя
      const teacherResponse = await fetch("http://localhost:8080/lesssched/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: props.name,
          methodicalDay: props.methodical,
          admin: props.admin,
          plan: []
        })
      });

      if (!teacherResponse.ok) throw new Error("Ошибка при создании учителя");
      const idText = await teacherResponse.text();
      const teacher = parseInt(idText, 10);

      console.log("teacher:", teacher);

      //  Формируем данные для teachersplan
      const dataToSave = props.teachersplan
        .filter(
          (block) => block.discipline && block.group && block.classroom && block.hours
        )
        .map((block) => ({
          teacherID: teacher,
          disciplineID: parseInt(block.discipline),
          groupID: parseInt(block.group),
          classroomID: parseInt(block.classroom),
          hours: parseInt(block.hours),
          subgroup: parseInt(block.subgroup)
        }));

      // 🔹 Сохраняем каждый блок teachersplan и собираем их ID
      console.log("dataToSave:", dataToSave)
      for (const plan of dataToSave) {
        const planResponse = await fetch("http://localhost:8080/lesssched/teachersplan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plan)
        });

        if (!planResponse.ok) throw new Error("Ошибка при сохранении плана");
      }
      
      console.log("Учитель и план успешно сохранены!");
      console.log("Учитель:", teacher);

      // 🔹 Обновляем список и закрываем форму
      if (props.onUpdateList) props.onUpdateList();
      if (props.onCloseForm) props.onCloseForm();

    } catch (err) {
      console.error("Ошибка:", err);
      alert("Ошибка при сохранении: " + err.message);
    }
    }

    else if (props.host == "planes") {
        try {
    // 1️⃣ Создаём основной план (пока с пустым plan)
        const planResponse = await fetch("http://localhost:8080/lesssched/planes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        name: props.name,
        grade: props.grade,
        plan: [] // временно пустой
        })
        });

        if (!planResponse.ok) throw new Error("Ошибка при создании плана");
        const idText = await planResponse.text();
        const plan = parseInt(idText, 10);

    // 2️⃣ Создаём каждую запись в planelements
        for (const el of props.planelements) {
        if (!el.discipline || !el.hours) continue; // пропускаем пустые блоки

        const elementResponse = await fetch("http://localhost:8080/lesssched/planelements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planID: plan,
          disciplineID: parseInt(el.discipline),
          hours: parseInt(el.hours)
        })
        });

        if (!elementResponse.ok)
            throw new Error("Ошибка при сохранении элемента плана");
        }


        console.log("✅ План и детали успешно сохранены!");
        console.log("План:", plan);

        props.onUpdateList?.();
        props.onCloseForm?.();
        } catch (err) {
          console.error("Ошибка:", err);
          alert("Ошибка при сохранении: " + err.message);
        }
    }

    else {
        function createData(props){
        

        if (props.host == "classes") {
            return {
                name: props.name
            }
        }
        else if (props.host == "disciplines") {
            return {
                name: props.name,
                priority: parseInt(props.priority),
            }
        }
        else if (props.host == "days") {
            return {
                name: props.name,
                maxLessons: props.priority
            }
        }
        else if (props.host == "groups") {
            return {
                name: props.name,
                planID: props.planes,
            }
        }
    }

        const newData = createData(props);        

            fetch(`http://localhost:8080/lesssched/${props.host}`, {
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
        <button className="add-button" type="button" onClick={toEdit ? changeToServer : sendToServer}>{toEdit ? "Сохранить изменения" : "Добавить"}</button>
    )
}