package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.beans.TaskField;
import com.example.career.talks.estimates_application.beans.TaskFieldEstimation;
import com.example.career.talks.estimates_application.repositories.MvpRepository;
import com.example.career.talks.estimates_application.repositories.TaskFieldEstimationRepository;
import com.example.career.talks.estimates_application.repositories.TaskRepository;
import com.example.career.talks.estimates_application.utils.DatabaseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;
    @Autowired
    private UserService userService;
    @Autowired
    private TaskFieldEstimationRepository estimationRepository;
    @Autowired
    private MvpRepository mvpRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

    public List<Task> findAll() {
        return repository.findAll(Sort.by("type", "id").ascending());
    }

    public Task save(Task task, Long id) {
        Optional<Mvp> optionalMvp = mvpRepository.findById(id);
        if (optionalMvp.isPresent()) {
            Mvp mvp = optionalMvp.get();
            task.setMvp(mvp);
            DatabaseUtils.linkDatabaseReference(task);
            return repository.save(task);
        }
        String errorMessage = "There was no mvp with this id";
        LOGGER.error(errorMessage);
        throw new RuntimeException(errorMessage);
    }

    public Optional<Task> find(Long id) {
        return repository.findById(id);
    }

    public Mvp getParentMvp(Long id) {
        Optional<Task> optionalTask = repository.findById(id);
        if (optionalTask.isPresent()) {
            return optionalTask.get().getMvp();
        }
        String errorMessage = "There was no task with this id";
        LOGGER.error(errorMessage);
        throw new RuntimeException(errorMessage);
    }

    public void delete(Long id) {
        Optional<Task> optionalTask = repository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setMvp(null);
            repository.save(task);
            repository.delete(task);
        }
    }

    public Task update(Task updatedTask, Long id) {
        Optional<Task> optionalTask = repository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setName(updatedTask.getName());
            task.setEstimated(updatedTask.getEstimated());
            return repository.save(task);
        }
        String errorMessage = "There was no mvp with this id";
        LOGGER.error(errorMessage);
        throw new RuntimeException(errorMessage);
    }

    public List<Task> findTasksByMvpId(Long mvpId) {
        try {
            return repository.findTaskByMvpIdOrderByTypeAscIdAsc(mvpId);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * Finds a task field in a task
     *
     * @param task
     * @param keyName
     * @return
     */
    public Optional<TaskField> findTaskFieldByName(Task task, String keyName) {
        return task.getTaskFields().stream()
                .filter(taskField -> taskField.getKeyName().equals(keyName))
                .findFirst();
    }


    public void updateEstimationsForField(TaskField taskField, double best, double likely, double worst) {
        taskField.getTaskFieldEstimations().forEach(est -> {
            est.setBest((int) Math.round(best));
            est.setLikely((int) Math.round(likely));
            est.setWorst((int) Math.round(worst));
            estimationRepository.save(est);
        });
    }

    public void saveEstimationsForField(TaskField taskField, double best, double likely, double worst) {
        estimationRepository.save(new TaskFieldEstimation((int) Math.round(best), (int) Math.round(likely), (int) Math.round(worst), taskField, userService.saveOrGetFinalUser()));
    }

    public void updateTaskComments(Task task) {
        Optional<Task> optionalTask = repository.findById(task.getId());
        if (optionalTask.isEmpty()) {
            return;
        }
        Task existentTask = optionalTask.get();
        existentTask.setComments(task.getComments());
        repository.save(existentTask);
    }

}
