package com.hitchhikar.account.repositories;

import java.util.List;
import com.hitchhikar.account.entities.Account;
import org.springframework.data.repository.CrudRepository;

public interface AccountRepository extends CrudRepository<Account, String> {

    List<Account> findByLastName(String lastName);
}