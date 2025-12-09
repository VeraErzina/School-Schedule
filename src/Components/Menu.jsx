import {useState, useEffect, useRef} from 'react'
import "./Menu.css"
import Element from './Element.jsx'
import DefaultForm from "./DefaultForm.jsx"
import TeacherForm from "./TeacherForm.jsx"
import GroupsForm from "./GroupsForm.jsx"
import "./Form.css"
import StopServer from "./StopServer.jsx"
import PlanForm from "./PlanForm.jsx"
import Start from "./Start.jsx"

export default function Menu(){

    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [formType, setFormType] = useState(null);
    const [activeHost, setActiveHost] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const formRef = useRef(null);


    function triggerRefresh() {
        setRefreshKey(prev => prev + 1); // просто увеличиваем число
    }

    function openForm(host, element) {
        console.log("openForm called:", { host, element });
        setSelectedData(element);
        setFormType(["teachers", "groups", "planes"].includes(host) ? host : "default");
        setActiveHost(host);
    }

    function closeForm() {
        setFormType(null);
        setActiveHost(null);
        setSelectedData(null);
    }

    function openMenu(){        
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => {
                setShowMenu(true);
            }, 700);
        }
        else {
            setShowMenu(false);
            setIsOpen(false);
        }
    }

    
 
    return(
        <>
        <div className="menu" aria-expanded={isOpen}>
            <button className="button-menu" aria-controls="primary-navigation" aria-expanded={isOpen} onClick={openMenu}>
            <svg 
                stroke="var(--button-color)" 
                fill="none" 
                class="hamburger" 
                viewBox="-10 -10 120 120" 
                width="70">

                <path    
                class="line" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M 20 40 H 80 A 1 1 0 0 1 80 60 H 20 A 1 1 0 0 1 20 20 H 50 V 90">
                </path>
            </svg>
            </button>
        
        {showMenu && 
            <ul className="menu-list">
                <li><Element name="Учителя" host="teachers" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><Element name="Кабинеты" host="classes" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><Element name="Классы" host="groups" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><Element name="Дни недели" host="days" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><Element name="Список уроков" host="disciplines" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><Element name="План уроков" host="planes" formRef={formRef} onOpenForm={openForm} onCloseForm={closeForm} refreshKey={refreshKey} triggerRefresh={triggerRefresh}/></li>
                <li><StopServer/></li>
                <li><Start/></li>
            </ul>
        }

        </div>
        {formType === "default" && activeHost && <DefaultForm host={activeHost} formRef={formRef} onUpdateList={triggerRefresh} onCloseForm={closeForm} toEdit={selectedData}/>}
        {formType === "teachers" && activeHost && <TeacherForm host={activeHost}  formRef={formRef} onUpdateList={triggerRefresh} onCloseForm={closeForm} toEdit={selectedData}/>}
        {formType === "planes" && activeHost && <PlanForm host={activeHost}  formRef={formRef} onUpdateList={triggerRefresh} onCloseForm={closeForm} toEdit={selectedData}/>}
        {formType === "groups" && activeHost && <GroupsForm host={activeHost}  formRef={formRef} onUpdateList={triggerRefresh} onCloseForm={closeForm} toEdit={selectedData}/>}
        </> 
    )
}