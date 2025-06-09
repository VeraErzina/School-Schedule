package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Comparator;

@Getter
@Setter
public class Teacher {
    private static int maxID = 0;
    @Getter
    private final static ArrayList<Teacher> teachers = new ArrayList<>();
    private int ID;
    private String name;
    private int maxHours;
    private int remainHours;
    private int gap;

    public Teacher(){
        maxID++;
        this.ID = maxID;
        teachers.add(this);
    }

    public Teacher(String name, int maxHours){
        super();
        this.gap = 0;
        this.name = name;
        this.maxHours = maxHours;
        remainHours = maxHours;
    }

    private static Teacher GetTeacher(int ID){
        for (Teacher t: teachers){
            if (t.getID() == ID) {
                return t;
            }
        }
        return null;
    }

    public static int Load(TeacherJSON t){
        Teacher newTeacher = null;
        if (t.getID()!=0){
            newTeacher = GetTeacher(t.getID());
        }
        if (newTeacher == null) {
            newTeacher = new Teacher(t.getName(), t.getMaxHours());
        }
        return newTeacher.getID();
    }

    public static int Load(String name, int maxHours){
        Teacher newTeacher = new Teacher(name, maxHours);
        return newTeacher.getID();
    }

    public static void Clear(){
        teachers.clear();
    }

    public static final Comparator<Teacher> COMPARE_BY_REMAIN = new Comparator<Teacher>() {
        @Override
        public int compare(Teacher lhs, Teacher rhs) {
            return lhs.getRemainHours() - rhs.getRemainHours() + (lhs.getGap()>Data.maxGap? 100 : 0);
        }
    };
}
