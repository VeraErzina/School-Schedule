package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GroupJSON {
    private int ID;
    private String name;
    private int grade;
    private int planLessons;

    public GroupJSON (int ID, String name, int grade, int planLessons){
        this.ID = ID;
        this.name = name; this.grade = grade; this.planLessons = planLessons;
    }

    public GroupJSON(Group group){
        this.ID = group.getID();
        this.name = group.getName();
        this.grade = group.getGrade();
        this.planLessons = group.getPlanLessons();
    }
}
