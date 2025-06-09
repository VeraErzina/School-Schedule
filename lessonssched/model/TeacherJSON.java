package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TeacherJSON {
    private int ID;
    private String name;
    private int maxHours;

    public TeacherJSON(int ID, String Name, int maxHours){
        this.ID = ID;
        this.name = name;
        this.maxHours = maxHours;
    }

    public TeacherJSON(Teacher teacher){
        this.ID = teacher.getID();
        this.name = teacher.getName();
        this.maxHours = teacher.getMaxHours();
    }
}
