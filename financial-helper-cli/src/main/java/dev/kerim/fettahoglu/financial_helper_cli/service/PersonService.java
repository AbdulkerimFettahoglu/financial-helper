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

    public Person savePerson(String name) {
        Optional<Person> personOpt = personRepository.findByName(name);
        if (personOpt.isPresent()) {
            throw new RuntimeException("person already exist.");
        }
        Person person = new Person();
        person.setName(name);
        return personRepository.save(person);
    }

    public String dumpPersonNames() {
        StringBuilder sb = new StringBuilder();
        personRepository.findAll().forEach(person ->
                sb.append(person.getName()).append(", "));
        return sb.toString();
    }
}
