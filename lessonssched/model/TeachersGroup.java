package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TeachersGroup {
    private Teacher teacher;
    private Group group;
    private String TName;
    private String GName;

    public TeachersGroup(Teacher teacher, Group group){
        this.teacher = teacher;
        this.group = group;
        this.TName = teacher.getName();
        this.GName = group.getName();
    }
}
