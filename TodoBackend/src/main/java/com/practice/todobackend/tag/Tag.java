package com.practice.todobackend.tag;

import jakarta.persistence.*;

@Entity
public class Tag {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    @Column(unique = true)

    @Id
    private String name;

    public Tag() {}

    public Tag(String name) {
        this.name = name;
    }

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }

    public String getName() {
        return name;
    }
}
