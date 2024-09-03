package com.practice.todobackend.task;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins ="*")
public class TaskController {

    private final TaskService taskService;
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        return ResponseEntity.ok(this.taskService.getAllTasks());
    }

    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        return ResponseEntity.ok(this.taskService.saveTask(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        boolean deleted = this.taskService.deleteTaskById(id);
        if (deleted) {
            return ResponseEntity.ok("Task deleted successfully");
        }

        return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        boolean updated = this.taskService.updateTask(id, updatedTask);

        if (updated) {
            return ResponseEntity.ok("Task updated successfully");
        }
        return new ResponseEntity<>("Task not found", HttpStatus.NOT_FOUND);

    }

    @GetMapping("/searchTag/{tag}")
    public ResponseEntity<List<Task>> getTasksByTag(@PathVariable String tag) {
        return ResponseEntity.ok(this.taskService.getTasksByTag(tag));
    }
}
