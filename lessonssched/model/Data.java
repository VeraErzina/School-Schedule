package erzinoi22.com.lessonssched.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

@Getter
@Setter
public class Data {
    public final static String DATA_PATH = "datasets/";
    public final static int maxLessons = 5;
    public final static int maxGap = 1;
    @Getter
    private final static ArrayList<WorkingDay> days = new ArrayList<>();
    @Getter
    private final static ArrayList<Classroom> classes = new ArrayList<>();
    @Getter
    private final static ArrayList<TeachersGroup> tgroups = new ArrayList<>();
    private static int currDay = -1;


    public static void init() throws IOException {
        boolean needSave = false;
        Load();
        if (days.isEmpty()) {
            days.add(new WorkingDay("Monday", maxLessons));
            days.add(new WorkingDay("Tuesday", maxLessons));
            days.add(new WorkingDay("Wednesday", maxLessons));
            days.add(new WorkingDay("Thursday", maxLessons));
            days.add(new WorkingDay("Friday", maxLessons));
            needSave = true;
        }
        if (Group.getGroups().isEmpty()) {
            Group.Load("2-А", 2, 2);
            Group.Load("2-Б", 2, 2);
            Group.Load("2-В", 2, 2);
            Group.Load("3-А", 2, 2);
            Group.Load("3-Б", 2, 2);
            Group.Load("3-В", 2, 2);
            Group.Load("4-А", 2, 2);
            Group.Load("4-Б", 2, 2);
            Group.Load("4-В", 2, 2);
            needSave = true;
        }
        if (Teacher.getTeachers().isEmpty()) {
            Teacher.Load("Алексеевская К. В.", 5);
            Teacher.Load("Лапшина О. В.", 5);
            Teacher.Load("Хмелева Л. Ц.", 5);
            Teacher.Load("Евгеньева М. А.", 5);
            needSave = true;
        }
        if(classes.isEmpty()) {
            classes.add(new Classroom("24"));
            classes.add(new Classroom("25"));
            needSave = true;
        }
        if (needSave){
            Save();
        }
    };

    public static void Save() throws IOException {
        ObjectMapper om = new ObjectMapper();
        om.enable(SerializationFeature.INDENT_OUTPUT);
        om.writeValue(new File(DATA_PATH+"days.json"),days);
        om.writeValue(new File(DATA_PATH+"groups.json"),getGroupJSONList(Group.getGroups()));
        om.writeValue(new File(DATA_PATH+"teachers.json"),getTeacherJSONList(Teacher.getTeachers()));
        om.writeValue(new File(DATA_PATH+"classes.json"),classes);
    }

    public static void Load() throws IOException {
        ObjectMapper om = new ObjectMapper();
        File file_days = new File(DATA_PATH + "days.json");
        if(file_days.exists()) {
            ArrayList<WorkingDay> tmp_days = om.readValue(file_days, new TypeReference<ArrayList<WorkingDay>>() {
            });
            days.addAll(tmp_days);
        }
        File file_groups = new File(DATA_PATH + "groups.json");
        if(file_groups.exists()) {
            ArrayList<GroupJSON> tmp_groups = om.readValue(file_groups, new TypeReference<ArrayList<GroupJSON>>() {
            });
            Group.Clear();
            for (GroupJSON g: tmp_groups) {
                Group.Load(g);
            }
        }
        File file_teachers = new File(DATA_PATH + "teachers.json");
        if(file_teachers.exists()) {
            ArrayList<TeacherJSON> tmp_teachers = om.readValue(file_teachers, new TypeReference<ArrayList<TeacherJSON>>() {
            });
            Teacher.Clear();
            for (TeacherJSON t: tmp_teachers) {
                Teacher.Load(t);
            }
        }
        File file_classes = new File(DATA_PATH + "classes.json");
        if(file_classes.exists()) {
            ArrayList<Classroom> tmp_classes = om.readValue(file_classes, new TypeReference<ArrayList<Classroom>>() {
            });
            classes.clear();
            classes.addAll(tmp_classes);
        }
    }

    public static ArrayList<Group> getGroupList(){
        ArrayList<Group> ret =  new ArrayList<>();
        for (Group gr: Group.getGroups()){
            if (gr.getRemainLessons()>0){
                ret.add(gr);
            }
        }
        Collections.sort(ret, Collections.reverseOrder(Group.COMPARE_BY_REMAIN));
        return ret;
    }

    public static ArrayList<GroupJSON> getGroupJSONList(){
        ArrayList<GroupJSON> ret = new ArrayList<>();
        for (Group gr: getGroupList()){
            ret.add(new GroupJSON(gr));
        }
        return ret;
    }

    public static ArrayList<GroupJSON> getGroupJSONList(ArrayList<Group> group){
        ArrayList<GroupJSON> ret = new ArrayList<>();
        for (Group gr: group){
            ret.add(new GroupJSON(gr));
        }
        return ret;
    }

    public static ArrayList<Classroom> getClassesList(){
        return new ArrayList<Classroom>(classes);
    }

    public static ArrayList<Teacher> getTeacherList(){
        ArrayList<Teacher> ret =  new ArrayList<>();
        for (Teacher t: Teacher.getTeachers()){
            if (t.getRemainHours()>0){
                ret.add(t);
            }
        }
        Collections.sort(ret, Collections.reverseOrder(Teacher.COMPARE_BY_REMAIN));
        return ret;
    }

    public static ArrayList<TeacherJSON> getTeacherJSONList(){
        ArrayList<TeacherJSON> ret = new ArrayList<>();
        for (Teacher t: getTeacherList()){
            ret.add(new TeacherJSON(t));
        }
        return ret;
    }

    public static ArrayList<TeacherJSON> getTeacherJSONList(ArrayList<Teacher> teacher){
        ArrayList<TeacherJSON> ret = new ArrayList<>();
        for (Teacher t: teacher){
            ret.add(new TeacherJSON(t));
        }
        return ret;
    }

    public static WorkingDay getNextDay(){
        currDay++;
        if (days.size()>currDay-1){
            return days.get(currDay);
        } else {
            return null;
        }
    }


}
