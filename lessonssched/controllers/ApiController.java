package erzinoi22.com.lessonssched.controllers;

import erzinoi22.com.lessonssched.model.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/lesssched")
public class ApiController {

    @GetMapping(path = "/days")
    List<WorkingDay> getDays(){
        return Data.getDays();
    }

    @GetMapping(path = "/teachers")
    List<TeacherJSON> getTeachers(){
        return Data.getTeacherJSONList();
    }

    @GetMapping(path = "/groups")
    List<GroupJSON> getGroups(){
        return Data.getGroupJSONList();
    }

    @GetMapping(path = "/classes")
    List<Classroom> getClasses(){
        return Data.getClasses();
    }

    @GetMapping(path = "/tgroups")
    List<TeachersGroup> getTGroups(){
        return Data.getTgroups();
    }

    @PostMapping(path = "/teachers")
    int createTeacher(@RequestBody TeacherJSON t){
        return Teacher.Load(t);
    }

    @PostMapping(path = "/groups")
    int createGroup(@RequestBody GroupJSON g){
        return Group.Load(g);
    }


}
