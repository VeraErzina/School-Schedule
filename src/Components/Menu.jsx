import {useState} from 'react'
import "./Menu.css"
import Element from './Element.jsx'
import DefaultForm from "./DefaultForm.jsx"
import TeacherForm from "./TeacherForm.jsx"
import "./Form.css"
import PlanForm from "./PlanForm.jsx"

export default function Menu(){

    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [formType, setFormType] = useState(null);
    const [activeHost, setActiveHost] = useState(null);
    const [isPlanOpen, setIsPlanOpen] = useState(false);

    function openForm(host) {
        setFormType(host === "teachers" || host === "groups" ? host : "default");
        setActiveHost(host);
    }

    function openPlan() {
        console.log("План открыт");
        setIsPlanOpen(true);
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
                <li><Element name="Учителя" host="teachers" onOpenForm={openForm}/></li>
                <li><Element name="Кабинеты" host="classes" onOpenForm={openForm}/></li>
                <li><Element name="Классы" host="groups" onOpenForm={openForm} onOpenPlan={openPlan}/></li>
                <li><Element name="Дни недели" host="days" onOpenForm={openForm}/></li>
                <li><Element name="Список уроков" host="lessonslist" onOpenForm={openForm}/></li>
            </ul>
        }

        </div>
        {formType === "default" && activeHost && <DefaultForm host={activeHost} />}
        {formType === "teachers" && activeHost && <TeacherForm host={activeHost} />}
        {isPlanOpen && <PlanForm/>}
        </>
    )
}