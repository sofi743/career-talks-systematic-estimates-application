package com.example.career.talks.estimates_application.services;

import com.example.career.talks.estimates_application.beans.Configuration;
import com.example.career.talks.estimates_application.beans.Ifd;
import com.example.career.talks.estimates_application.repositories.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConfigurationService {
    @Autowired
    private ConfigurationRepository repository;
    @Autowired
    private IfdService ifdService;
    public List<Configuration> findAll() {
        return repository.findAll(Sort.by("id").ascending());
    }
    public Configuration save(Configuration configuration, Long id) {
        Optional<Ifd> optionalIfd = ifdService.find(id);
        if (optionalIfd.isPresent()) {
            Configuration oldConfig = optionalIfd.get().getConfiguration();
            if (oldConfig != null) {
                oldConfig.setEstimationType(configuration.getEstimationType());
                oldConfig.setComplexity(configuration.getComplexity());
                return repository.save(oldConfig);
            } else {
                configuration.setIfd(optionalIfd.get());
                return repository.save(configuration);
            }
        }
        return null;
    }
}
