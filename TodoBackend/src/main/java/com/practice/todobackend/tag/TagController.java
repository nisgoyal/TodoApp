package com.practice.todobackend.tag;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
@CrossOrigin("*")
public class TagController {

    private final TagService tagService;
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.findAll());
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        return ResponseEntity.ok(tagService.save(tag));
    }

//    @DeleteMapping
//    public ResponseEntity<String> deleteTag(@RequestBody Tag tag) {
//        boolean deleted = tagService.delete(tag.getId());
//        if (deleted) {
//            return ResponseEntity.ok("Tag deleted successfully");
//        }
//
//        return ResponseEntity.badRequest().build();
//    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Tag> getTag(@PathVariable Long id) {
//        return ResponseEntity.ok(tagService.findById(id));
//    }

}
