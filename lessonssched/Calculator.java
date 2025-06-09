package erzinoi22.com.lessonssched;

import erzinoi22.com.lessonssched.model.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class Calculator {

    public static void main(String[] args) throws IOException {
        Data.init();
        Calculate();
//        Data.Save();
    }

    public static void Calculate() throws IOException {
        ArrayList<Lesson> lessons = new ArrayList<>();
        WorkingDay currDay = Data.getNextDay();
        int lessonNum = 1;
        boolean isFinished = false;
        boolean isError = false;
        boolean isNextDay =false;
        ArrayList<Group> groupsList = Data.getGroupList();
        ArrayList<Classroom> classList = Data.getClassesList();
        ArrayList<Teacher> teacherList = Data.getTeacherList();
        while (!(isFinished || isError)) {
            Group gr1 = null;
            Group gr2 = null;
            Classroom cl1 = null;
            Classroom cl2 = null;
            Teacher t1 = null;
            Teacher t2 = null;
            if ((groupsList.size() < 2) || (classList.size() < 2) || (teacherList.size() < 2)) {
                lessonNum++;
                if (lessonNum > Data.maxLessons) {
                    currDay = Data.getNextDay();
                    lessonNum = 1;
                    isNextDay = true;
                }
                if (currDay == null) {
                    isError = true;
                } else {
                    groupsList = Data.getGroupList();
                    classList = Data.getClassesList();
                    teacherList = Data.getTeacherList();
                    if (groupsList.size() < 2) {
                        isFinished = true;
                    }
                    if (teacherList.size() < 2) {
                        isError = true;
                    }
                    if (!(isFinished || isError)) {
                        for (Teacher t : teacherList) {
                            if (isNextDay) {
                                t.setGap(0);
                            } else {
                                t.setGap(t.getGap() + 1);
                            }
                        }
                    }
                }
            }
            if (!(isFinished || isError)) {
                gr1 = groupsList.getFirst();
                groupsList.removeFirst();
                gr1.setRemainLessons(gr1.getRemainLessons() - 1);
                gr2 = groupsList.getFirst();
                groupsList.removeFirst();
                gr2.setRemainLessons(gr2.getRemainLessons() - 1);
                cl1 = classList.getFirst();
                classList.removeFirst();
                cl2 = classList.getFirst();
                classList.removeFirst();
                t1 = teacherList.getFirst();
                teacherList.removeFirst();
                t1.setRemainHours(t1.getRemainHours() - 1);
                t2 = teacherList.getFirst();
                teacherList.removeFirst();
                t2.setRemainHours(t2.getRemainHours() - 1);
                lessons.add(new Lesson(currDay, lessonNum, cl1, t1, gr1));
                lessons.add(new Lesson(currDay, lessonNum, cl2, t2, gr2));
                t1.setGap(0);
                t2.setGap(0);
            }
        }
        if (isFinished) {
            File file = new File("lessons.txt");
            try (FileWriter fw = new FileWriter(file)) {
                for (Lesson l : lessons) {
                    fw.write(l.getDay().getName() + ", урок " + l.getLessonNum() + ": " + l.getTeacher().getName()
                            + ", " + l.getGroup().getName() + ", каб. " + l.getClassroom().getName()+"\n");
                    System.out.println(l.getDay().getName() + ", урок " + l.getLessonNum() + ": " + l.getTeacher().getName()
                            + ", " + l.getGroup().getName() + ", каб. " + l.getClassroom().getName());
                }
            }
        } else {
            System.out.println("Error");
        }
    }
}
