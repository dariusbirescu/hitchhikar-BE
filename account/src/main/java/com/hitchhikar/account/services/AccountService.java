package com.hitchhikar.account.services;


import com.hitchhikar.account.entities.Account;
import com.hitchhikar.account.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {


    @Autowired
    private AccountRepository accountRepository;

    public void registerNewAccount(Account newAccount) {
        accountRepository.save(newAccount);
    }

    public Optional<Account> accountAlreadyExists(String email){
        return accountRepository.findById(email);
    }
}
