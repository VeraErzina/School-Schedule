package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Lesson {
    private WorkingDay day;
    private int lessonNum;
    private Classroom classroom;
    private Teacher teacher;
    private Group group;

    public Lesson (WorkingDay day, int lessonNum, Classroom classroom, Teacher teacher, Group group){
        this.day = day;
        this.lessonNum = lessonNum;
        this.classroom = classroom;
        this.teacher = teacher;
        this.group = group;
    }
}
