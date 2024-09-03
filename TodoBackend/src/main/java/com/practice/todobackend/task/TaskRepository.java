package com.practice.todobackend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query(
        "SELECT t1 " +
        "FROM Task t1 " +
        "INNER JOIN t1.tags t2 " +
        "WHERE t2.name LIKE %:tag%"
    )
    List<Task> getTasksByTag(@Param("tag")String tag);

//    @Query(
//            "SELECT t1 " +
//                    "FROM Task t1"
//    )
//    List<Task> getTasksByTag(@Param("tag")String tag);
}
