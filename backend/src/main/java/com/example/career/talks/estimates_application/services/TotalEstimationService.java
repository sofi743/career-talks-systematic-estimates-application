package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.beans.Task;
import com.example.career.talks.estimates_application.beans.TotalEstimation;
import com.example.career.talks.estimates_application.models.Notification;
import com.example.career.talks.estimates_application.models.NotificationState;
import com.example.career.talks.estimates_application.repositories.IfdRepository;
import com.example.career.talks.estimates_application.repositories.MvpRepository;
import com.example.career.talks.estimates_application.repositories.TaskRepository;
import com.example.career.talks.estimates_application.repositories.TotalEstimationRepository;
import com.example.career.talks.estimates_application.utils.NotificationTopics;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TotalEstimationService {
    @Autowired
    private TotalEstimationRepository repository;
    @Autowired
    private IfdRepository ifdRepository;
    @Autowired
    private IfdService ifdService;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private MvpRepository mvpRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private NotificationService notificationService;

    public List<TotalEstimation> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    /**
     * Recalculates the totals for ifd and all children - mvps and tasks - updates all
     *
     */
    public void saveIfdTotal() {
        Optional<Ifd> optionalIfd = ifdService.findOne();
        if (optionalIfd.isPresent()) {
            Ifd ifd = optionalIfd.get();
            TotalEstimation totalEstimation = new TotalEstimation(repository.sumIfdTotals(optionalIfd.get().getId()));
            ifd.getMvps().forEach(mvp -> {
                mvp.getTasks().forEach(task -> saveTaskTotal(task.getId()));
                saveMvpTotal(mvp.getId());
            });
            ifd.setTotalEstimation(totalEstimation);
            ifdRepository.save(ifd);
        }
    }

    /**
     * Recalculates the total for current mvp and all task children
     *
     * @param id
     */
    public void saveMvpTotal(Long id) {
        Optional<Mvp> optionalMvp = mvpRepository.findById(id);
        if (optionalMvp.isPresent()) {
            Mvp mvp = optionalMvp.get();
            mvp.getTasks().forEach(task -> saveTaskTotal(task.getId()));
            mvp.setTotalEstimation(new TotalEstimation(repository.sumMvpTotals(id)));
            mvpRepository.save(mvp);
        }
    }

    /**
     * Recalculates the totals for current task
     *
     * @param id
     */
    public void saveTaskTotal(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTotalEstimation(new TotalEstimation(repository.sumTaskTotals(id)));
            taskRepository.save(task);
        }
    }

    /**
     * Updates the total estimations with new values sent in the ifd object Used if user wants to edit something in the final estimations
     *
     * @param ifd
     */

    @Transactional
    public void updateIfdTotals(Ifd ifd) {
        Optional<Ifd> optionalIfd = ifdService.find(ifd.getId());
        if (optionalIfd.isEmpty()) {
            return;
        }
        Ifd existentIfd = optionalIfd.get();
        ifd.getMvps().forEach(this::updateMvpTotals);

        if (ifd.getTotalEstimation() != null) {
            TotalEstimation managedEstimation = entityManager.merge(ifd.getTotalEstimation());
            existentIfd.setTotalEstimation(managedEstimation);
        }

        ifdRepository.save(existentIfd);
        notifyLastEstimations(existentIfd);

    }
    private void notifyLastEstimations(Ifd ifd) {
        Notification<Ifd> notification = new Notification<>();
        notification.setTopic(NotificationTopics.LAST_ESTIMATIONS_NOTIFICATION_TOPIC);
        notification.setState(NotificationState.FULL);
        notification.setData(ifd); // Send the full list of users
        notificationService.sendLastEstimationsNotification(notification);
    }
    @Transactional
    public void updateMvpTotals(Mvp mvp) {
        Optional<Mvp> optionalMvp = mvpRepository.findById(mvp.getId());
        if (optionalMvp.isEmpty()) {
            return;
        }
        Mvp existentMvp = optionalMvp.get();

        mvp.getTasks().forEach(this::updateTaskTotalsAndComments);

        if (mvp.getTotalEstimation() != null) {
            TotalEstimation managedEstimation = entityManager.merge(mvp.getTotalEstimation());
            existentMvp.setTotalEstimation(managedEstimation);
        }

        mvpRepository.save(existentMvp);
    }

    @Transactional
    public void updateTaskTotalsAndComments(Task task) {
        Optional<Task> optionalTask = taskRepository.findById(task.getId());
        if (optionalTask.isEmpty()) {
            return;
        }
        Task existentTask = optionalTask.get();

        if (task.getTotalEstimation() != null) {
            TotalEstimation managedEstimation = entityManager.merge(task.getTotalEstimation());
            existentTask.setTotalEstimation(managedEstimation);
        }

        existentTask.setComments(task.getComments());
        taskRepository.save(existentTask);
    }
}
