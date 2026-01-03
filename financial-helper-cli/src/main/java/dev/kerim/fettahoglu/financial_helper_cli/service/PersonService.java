package dev.kerim.fettahoglu.financial_helper_cli.service;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import dev.kerim.fettahoglu.financial_helper_cli.repo.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;

    public Person savePerson(Person person) {
        if (Optional.ofNullable(person.getId()).isPresent()) {
            Optional.ofNullable(personRepository.findById(person.getId())).get()
                .orElseThrow(() -> {
                    throw new RuntimeException("person not found.");
                });
        }
        return personRepository.save(person);
    }
}
