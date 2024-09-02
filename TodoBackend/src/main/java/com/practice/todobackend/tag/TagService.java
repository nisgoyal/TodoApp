package com.practice.todobackend.tag;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagRepository tagRepository;
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

//    public Tag findById(Long id) {
//        return tagRepository.findById(id).orElse(null);
//    }
//
//    public boolean delete(Long id) {
//        try {
//            tagRepository.deleteById(id);
//            return true;
//        }
//        catch (Exception e) {
//            return false;
//        }
//    }
}
