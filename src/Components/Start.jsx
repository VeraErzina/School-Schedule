import "./Button.css";
import { useState } from "react";
import "./Start.css";

export default function Start(){

    const [tableData, setTableData] = useState(null);

    function getResult(){                                                       /*Отправляем серверу запрос на выполнение команды и получаем данные*/ 
        fetch("http://localhost:8080/lesssched")
        .then(response => {
            if(!response.ok) {
                throw new Error("Ошибка запроса!")
            }
            return response.json();
        })
        .then(data => {
            setTableData(data);
            console.log("Данные получены");
            console.log("function getResult:",data);
        })
        .catch(error => {
            console.error("Ошибка при получении данных:", error.message);
        })
        
    }

    function createTable(data){     
                                                                                                    /*Создаем таблицу с расписанием*/ 
        const uniqueDays = [...new Set(data.map(element => element.day))];
        const lessonArray = ["1 урок", "2 урок", "3 урок", "4 урок", "5 урок", "6 урок"];
        const quantityDays = uniqueDays.length;
        const extraDays = [0, 5, 4, 3, 2, 1, 0];
        
        function lessonsNum(){
            let result = [];
            for (let i = 0; i < quantityDays; i++){
                lessonArray.forEach((element, index) => {
                    result.push(<td key={`${i}-${index}`}>{element}</td>);
                })}
            return result;
        }
        
        function groupByTeachers(data){
            
            const grouped = data.reduce((accumulator, item) => {
                const teacher = item.teacher;
                if (!accumulator[teacher]){
                    accumulator[teacher] = [];
                }
                accumulator[teacher].push(item);
                return accumulator;
            },{})

            return Object.entries(grouped).map(([teacher, lessons]) => ({
                teacher, 
                lessons
            }))
        }




        function renderTeacherRow(teacherObj, uniqueDays, quantityDays, extraDays) {
            const cells = [];

            for (let i = 0; i < uniqueDays.length; i++) {
                for (let j = 1; j <= 6; j++) {
                    const match = teacherObj.lessons.find(
                        (obj) =>
                        obj.day === uniqueDays[i] &&
                        Number(obj.lessonnum) === j
                    );

                    if (match) {
                        cells.push(
                            <td key={`${teacherObj.teacher}-${i}-${j}`}>
                                {`${match.group} ${match.classroom}`}
                            </td>
                        );
                    } else {
                        cells.push(
                            <td key={`${teacherObj.teacher}-${i}-${j}`}></td>
                        );
                    }
                }
            }

            return (
                <tr key={teacherObj.teacher}>
                    <td colSpan={quantityDays + extraDays[quantityDays]}>{teacherObj.teacher}</td>
                    {cells}
                </tr>
            );
        }


        function createTeachersRows(data, uniqueDays, extraDays, quantityDays) {
            const groupedTeachers = groupByTeachers(data);
            return groupedTeachers.map((teacherObj) =>
                renderTeacherRow(teacherObj, uniqueDays, quantityDays, extraDays)
            );
        }



        return(
            <table>
                <thead>
                    <tr>
                        <th colSpan={6} rowSpan={2}></th>
                        {uniqueDays.map((element, index) => (
                            <th colSpan={quantityDays + extraDays[quantityDays]} key={index}>{element}</th>
                        ))}
                    </tr>
                    <tr>
                        {lessonsNum()}
                    </tr>
                </thead>
                <tbody>          
                    {createTeachersRows(data, uniqueDays, extraDays, quantityDays)}
                </tbody>               
            </table> 
        )
    }



    return(
        <>
        <button className="button-start" onClick={() => getResult()}>СОСТАВИТЬ РАСПИСАНИЕ</button>
        {tableData && createTable(tableData)}
        </>
    )
}



