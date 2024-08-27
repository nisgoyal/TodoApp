package com.practice.todobackend.task;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task saveTask(Task task) {
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
            taskRepository.save(taskToUpdate);

            return true;
        }

        return false;
    }
}
