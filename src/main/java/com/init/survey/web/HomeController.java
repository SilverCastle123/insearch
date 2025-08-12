package com.init.survey.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("message", "Hello JSP on external Tomcat!");
        return "index";
    }

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("title", "Hello");
        model.addAttribute("message", "Hello from JSP");
        return "hello";
    }
}
