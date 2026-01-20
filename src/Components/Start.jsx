import { useState } from "react";
import "./Start.css";
import "./Menu.css";

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

    function createTable(data){                                                 /*Создаем таблицу с расписанием*/ 

        const weekOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];                                                                                            
        const uniqueDays = [...new Set(data.map(element => element.day))].sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
        const lessonArray = [...new Set(data.map(element => element.lessonnum))].sort((a, b) => a - b);
        const quantityDays = uniqueDays.length;
        const quantityLessons = lessonArray.length;
        const extraDays = [0, 5, 4, 3, 2, 1, 0];
        
        function lessonsNum(){
            let result = [];
            for (let i = 0; i < quantityDays; i++){
                lessonArray.forEach((element, index) => {
                    result.push(<td key={`${i}-${index}`}>{element} урок</td>);
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




        function renderTeacherRow(teacherObj, uniqueDays, quantityDays, extraDays, quantityLessons) {
            const cells = [];
            const classroomSet = new Set;

            for (let i = 0; i < uniqueDays.length; i++) {
                for (let j = 1; j <= quantityLessons; j++) {
                    const match = teacherObj.lessons.find(
                        (obj) =>
                        obj.day === uniqueDays[i] &&
                        Number(obj.lessonnum) === j
                    );

                    if (match) {
                        cells.push(
                            <td key={`${teacherObj.teacher}-${i}-${j}`}>
                                {`${match.group}`}
                            </td>
                        );
                        classroomSet.add(match.classroom);
                    } else {
                        cells.push(
                            <td key={`${teacherObj.teacher}-${i}-${j}`}></td>
                        );
                    }
                }
            }

            return (
                <tr key={teacherObj.teacher}>
                    <td colSpan={quantityDays + extraDays[quantityDays]-1}>{teacherObj.teacher}</td>
                    <td> {classroomSet.size > 0 
                        ? Array.from(classroomSet).join(' / ')
                        : ''}
                    </td>
                    {cells}
                </tr>
            );
        }


        function createTeachersRows(data, uniqueDays, extraDays, quantityDays, quantityLessons) {
            const groupedTeachers = groupByTeachers(data);
            return groupedTeachers.map((teacherObj) =>
                renderTeacherRow(teacherObj, uniqueDays, quantityDays, extraDays, quantityLessons)
            );
        }

        function printTable() {
        const table = document.querySelector(".final-table").innerHTML;
        const newWin = window.open("");
        newWin.document.write(`
        <html>
        <head>
            <title>Расписание</title>
            <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 4px; text-align: center; }
            tr { page-break-inside: avoid; }
            @page { size: A4 landscape; margin: 10mm; }
            </style>
        </head>
        <body>${table}</body>
        </html>
        `);
        newWin.document.close();
        newWin.print();
        }


        return(
            <div className="final-table">
            <table >
                <thead>
                    <tr>
                        <th colSpan={6} rowSpan={2}></th>
                        {uniqueDays.map((element, index) => (
                            <th colSpan={quantityLessons} key={index}>{element}</th>
                        ))}
                    </tr>
                    <tr>
                        {lessonsNum()}
                    </tr>
                </thead>
                <tbody>          
                    {createTeachersRows(data, uniqueDays, extraDays, quantityDays, quantityLessons)}
                </tbody>               
            </table>
            <button onClick={printTable}>
            🖨 Печать таблицы
            </button>
            </div>
        )
    }


    return(
        <>
        <div className="start" onClick={() => getResult()}>Составить расписание</div>
        {tableData && createTable(tableData)}
        </>
    )
}



