package com.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class TestController {

    @GetMapping("/hello")
    public String helloUser() {
        return "Hello User! You are authenticated.";
    }
}
