package erzinoi22.com.lessonssched.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Classroom {
    private static int maxID = 0;
    private int ID;
    private String name;

    public Classroom(){
        maxID++;
        this.ID = maxID;
    }

    public Classroom(String name){
        super();
        this.name = name;
    }
}
