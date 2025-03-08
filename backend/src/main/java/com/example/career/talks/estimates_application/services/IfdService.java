package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.repositories.IfdRepository;
import com.example.career.talks.estimates_application.utils.DatabaseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IfdService {
    @Autowired
    private IfdRepository repository;

    public List<Ifd> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }

    public Ifd save(Ifd ifd) {
        Optional<Ifd> optionalIfd = findOne();
        if (optionalIfd.isEmpty()) {
            DatabaseUtils.linkDatabaseReference(ifd);
            return repository.save(ifd);
        }
        return optionalIfd.get();
    }
    public void delete(Ifd ifd) {
        repository.delete(ifd);
    }

    public void deleteAll() {
        repository.deleteAll();
    }

    public Optional<Ifd> find(Long id) {
        return repository.findById(id);
    }

    public Optional<Ifd> findOne() {
        return repository.findAll(Sort.by("id").ascending()).stream().findAny();
    }
}
