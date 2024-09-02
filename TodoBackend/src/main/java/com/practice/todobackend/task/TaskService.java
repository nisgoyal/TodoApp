package com.practice.todobackend.task;

import com.practice.todobackend.tag.Tag;
import com.practice.todobackend.tag.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TagRepository tagRepository;

    public TaskService(TaskRepository taskRepository, TagRepository tagRepository) {
        this.taskRepository = taskRepository;
        this.tagRepository = tagRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task saveTask(Task task) {

        Set<Tag> tags = task.getTags();
        tags.forEach(tag -> {
            if(tagRepository.findById(tag.getName()).isEmpty()) {
                tagRepository.save(tag);
            }
        });

        return taskRepository.save(task);
    }

    public boolean deleteTaskById(Long id) {
        try {
            taskRepository.deleteById(id);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    public boolean updateTask(Long id, Task task) {
        Task taskToUpdate = taskRepository.findById(task.getId()).orElse(null);
        if (taskToUpdate != null) {
            taskToUpdate.setTitle(task.getTitle());
            taskToUpdate.setDescription(task.getDescription());
            taskToUpdate.setDueDate(task.getDueDate());

            for (Tag tag : task.getTags()) {
                if(tagRepository.findById(tag.getName()).isEmpty()) {
                    tagRepository.save(tag);
                }
            }
            taskToUpdate.setTags(task.getTags());
            taskRepository.save(taskToUpdate);

            return true;
        }

        return false;
    }
}
