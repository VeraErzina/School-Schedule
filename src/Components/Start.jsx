import "./Button.css";
import { useState } from "react";
import "./Start.css";

export default function Start(){

    const [tableData, setTableData] = useState(null);

    function getResult(){                                                       /*Отправляем серверу запрос на выполнение команды и получаем данные*/ 
        fetch("http://localhost:3001/lesssched")
        .then(response => {
            if(!response.ok) {
                throw new Error("Ошибка запроса!")
            }
            return response.json();
        })
        .then(data => {
            setTableData(data);
            console.log("Данные получены");
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




        function renderTeacherRow(teacherObj, uniqueDays, quantityDays) {
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
                    <td colSpan={quantityDays + 1}>{teacherObj.teacher}</td>
                    {cells}
                </tr>
            );
        }


        function createTeachersRows(data, uniqueDays) {
            const groupedTeachers = groupByTeachers(data);
            return groupedTeachers.map((teacherObj) =>
                renderTeacherRow(teacherObj, uniqueDays, quantityDays)
            );
        }



        return(
            <table>
                <thead>
                    <tr>
                        <th colSpan={quantityDays + 1}></th>
                        {uniqueDays.map((element, index) => (
                            <th colSpan={quantityDays + 1} key={index}>{element}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="6"></td>
                        {lessonsNum()}
                    </tr>
                    {createTeachersRows(data, uniqueDays)}
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



/*
    onClick={() => getResult()}


    function createTable(data){

        const uniqueDays = [...new Set(data.map(element => element.data)];
        const lessonArray = [1 урок, 2 урок, 3 урок, 4 урок, 5 урок, 6 урок];
        const quantityDays = uniqueDays.length;

        const uniqueTeachers = [...new Set(data.map(element => element.teacher))]

        function lessonsNum(){
            let result = [];
            for (let i = 0; i < quantityDays; i++){
                lessonArray.forEach((element, index) => {
                    result.push(<td key={`${i}-${index}`}>{element}</td>);
                })
            return result;
        }


        function groupByTeachers(data) {

            const grouped = data.reduce((accumulator, item) => {
            
                const teacher = item.teacher;             мы создаем объект accumulator{
                                                                teacher: [{item}, {item}, ...]
                                                                teacher: [{item}]      
                                                         }
                if (!accumulator[teacher]){
                    accumulator[teacher] = [];
                }
                accumulator[teacher].push(item);
                return accumulator;
            },{})

            return Object.entries(grouped).map(([teacher, lessons]) => ({
                teacher,
                lessons
            }));

        }

Object.entries(grouped) превращает объект в массив пар:

[
  ["Иванов", [ ...уроки Иванова... ]],
  ["Петров", [ ...уроки Петрова... ]]
]

    map(...) преобразует каждую пару в объект:

{ teacher: "Иванов", lessons: [ ... ] }


teachersLessons = groupByTeachers(data);
    

    teachersLessons.forEach(element, index) => {
        <tr>element[index].teacher</tr>
        element[index].lessons.forEach(obj, index)
            
                for (let i=1; i < 7; i++){

        
            }
        
        
        
    }


        каждый элемент нашего массива объектов { teacher: "Иванов", lessons: [ {...}, {...} ] }
            создаем строку <tr> с текстом свойства teacher
            потом нам надо для этого teacher рассмотреть все его объекты в массиве свойства lessons
                element[index].lessons.forEach(obj, index) - обращаемся к свойству lessons каждого учителя и для каждого мы должны добавлять новую ячейку таблицы, но
                мы так сделать не можем, потому что мб нам придется создавать пустые ячейки, получается мы должны делать фиксированное кол-во проверок через два 
                вложенных цикла
                

            for (let i = 0; i<5; i++) - дни недели, их пять
                for (let j = 1; j<7; j++) - кол-во уроков
                 {
                    if (obj.day == uniqueDays[i]) && (obj.lessonnum = j){
                        <td>obj.group obj.classroom</td>
                    }
                    else {
                        <td></td>
                    }
                 }
 

                







        return(
            <table>
                <thead>
                    <tr>
                        {uniqueDays.map(element => (
                            <th key={element}>{element}</th>
                        ))}
                    </tr>
                    <tr>
                        {lessonNum()}
                    </tr>
                </thead>
                <tbody>
                    


                </tbody>
            </table> 

        )
    }








*/ 