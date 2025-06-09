package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Comparator;

@Getter
@Setter
public class Group {
    private static int maxID = 0;
    @Getter
    private final static ArrayList<Group> groups = new ArrayList<>();
    private int ID;
    private String name;
    private int grade;
    private int planLessons;
    private int remainLessons;

    public Group(){
        maxID++;
        this.ID = maxID;
        groups.add(this);
    }

    public Group (String name, int grade, int planLessons){
        super();
        this.name = name; this.grade = grade; this.planLessons = planLessons; this.remainLessons = planLessons;
    }

    private static Group GetGroup(int ID){
        for (Group g: groups){
            if (g.getID() == ID) {
                return g;
            }
        }
        return null;
    }

    public static int Load(GroupJSON gr){
        Group newGroup = null;
        if (gr.getID() != 0){
            newGroup = GetGroup(gr.getID());
        }
        if (newGroup == null){
            newGroup = new Group(gr.getName(),gr.getGrade(),gr.getPlanLessons());
        }
        return newGroup.getID();
    }

    public static int Load(String name, int grade, int planLessons){
        Group newGroup = new Group(name,grade,planLessons);
        return newGroup.getID();
    }

    public static void Clear(){
        groups.clear();
    }


    public static final Comparator<Group> COMPARE_BY_REMAIN = new Comparator<Group>() {
        @Override
        public int compare(Group lhs, Group rhs) {
            return lhs.getRemainLessons() - rhs.getRemainLessons();
        }
    };
}
