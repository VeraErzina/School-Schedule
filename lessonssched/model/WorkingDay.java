package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkingDay {
    private static int maxID = 0;
    private int ID;
    private String name;
    private int maxLessons;

    public WorkingDay(){
        maxID++;
        this.ID = maxID;
    }

    public WorkingDay(String name, int maxLessons){
        super();
        this.name = name;
        this.maxLessons = maxLessons;
    }

}
