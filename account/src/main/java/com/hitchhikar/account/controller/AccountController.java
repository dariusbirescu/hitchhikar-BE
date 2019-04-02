package com.hitchhikar.account.controller;


import com.hitchhikar.account.entities.Account;
import com.hitchhikar.account.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController(value = "/account")
public class AccountController {


    @Autowired
    private AccountService accountService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> registerAccount(@RequestBody Account newAccount) {
        if(accountService.accountAlreadyExists(newAccount.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already exists",HttpStatus.BAD_REQUEST);
        }
        accountService.registerNewAccount(newAccount);
        return new ResponseEntity<>("Welcome, "+ newAccount.getFirstName(),HttpStatus.CREATED);
    }

}
