package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.beans.Mvp;
import com.example.career.talks.estimates_application.repositories.MvpRepository;
import com.example.career.talks.estimates_application.utils.DatabaseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MvpService {
    @Autowired
    private MvpRepository repository;
    @Autowired
    private IfdService ifdService;
    private static final Logger LOGGER = LoggerFactory.getLogger(MvpService.class);

    public List<Mvp> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    public Mvp save(Mvp mvp) {
        System.out.println(mvp.toString());
        Optional<Ifd> optionalIfd = ifdService.findOne();
        if (optionalIfd.isPresent()) {
            mvp.setIfd(optionalIfd.get());
            DatabaseUtils.linkDatabaseReference(mvp);
            return repository.save(mvp);
        }
        String errorMessage = "No ifd registered yet";
        LOGGER.error(errorMessage);
        throw new RuntimeException(errorMessage);
    }

    public Optional<Mvp> find(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        Optional<Mvp> optionalMvp = repository.findById(id);
        if (optionalMvp.isPresent()) {
            Mvp mvp = optionalMvp.get();
            mvp.setIfd(null);
            repository.save(mvp);
            repository.delete(mvp);
        }
    }

    public Mvp updateName(String newName, Long id) {
        Optional<Mvp> optionalMvp = repository.findById(id);
        if (optionalMvp.isPresent()) {
            Mvp mvp = optionalMvp.get();
            mvp.setName(newName);
            return repository.save(mvp);
        }
        throw new RuntimeException("No mvp found with this id");
    }
}
