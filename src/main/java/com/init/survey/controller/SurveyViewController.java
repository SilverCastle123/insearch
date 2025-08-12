package com.init.survey.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Comparator;

import com.init.survey.dto.SurveyDTO;
import com.init.survey.dto.SurveySaveRequest.QuestionDTO.ChoiceDTO;
import com.init.survey.dto.SurveySaveRequest.QuestionDTO.GridCategoryDTO;
import com.init.survey.service.SurveyService;

import lombok.RequiredArgsConstructor;

/*
	설문지 컨트롤러
	작성일 : 2025.06.11
	작성자 : -
*/

@Controller
@RequiredArgsConstructor
public class SurveyViewController {
	
	 private final SurveyService surveyService;
	
	// 설문지 작성 페이지
    @RequestMapping("/form/create.do")
    public String create() {
        return "form/create";
    }

    
    // 메인페이지
    @GetMapping("/main.do")
    public String showSurveyList(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 @RequestParam(required = false) String search,
                                 Model model) {
        Page<SurveyDTO> surveyPage;
        if (search != null && !search.trim().isEmpty()) {
            surveyPage = surveyService.searchSurveys(search, page, size);
        } else {
            surveyPage = surveyService.getSurveysPaged(page, size);
        }

        model.addAttribute("surveyList", surveyPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", surveyPage.getTotalPages());
        model.addAttribute("hasNext", surveyPage.hasNext());
        model.addAttribute("hasPrevious", surveyPage.hasPrevious());
        model.addAttribute("search", search);

        return "main/main";                 
    }
    
    
    // 설문지 상세보기 페이지
    @GetMapping("/form/detail.do")
    public String showSurveyDetail(@RequestParam("id") Long id, Model model) {
        SurveyDTO survey = surveyService.getSurveyById(id);
        
        if (survey.getQuestions() != null) {
            // 문항 정렬
            survey.getQuestions().sort(Comparator.comparingInt(SurveyDTO.QuestionDTO::getQuestionOrder));

            for (SurveyDTO.QuestionDTO question : survey.getQuestions()) {
                if (question.getChoices() != null) {
                    // 객관식 보기 정렬
                    question.getChoices().sort(Comparator.comparingInt(ChoiceDTO::getChoiceOrder));
                }
                if (question.getCategories() != null) {
                    // 그리드 카테고리 정렬
                    question.getCategories().sort(Comparator.comparingInt(GridCategoryDTO::getCategoryOrder));
                }
            }
        }
          
        model.addAttribute("survey", survey);
        
        
        return "form/detail";
    }
    
    // 설문지 응답 페이지
    @GetMapping("/form/response.do")
    public String showSurveyResponse(@RequestParam("id") Long id, Model model) {
        SurveyDTO survey = surveyService.getSurveyById(id);
        
        if (survey.getQuestions() != null) {
            // 문항 정렬
            survey.getQuestions().sort(Comparator.comparingInt(SurveyDTO.QuestionDTO::getQuestionOrder));

            for (SurveyDTO.QuestionDTO question : survey.getQuestions()) {
                if (question.getChoices() != null) {
                    // 객관식 보기 정렬
                    question.getChoices().sort(Comparator.comparingInt(ChoiceDTO::getChoiceOrder));
                }
                if (question.getCategories() != null) {
                    // 그리드 카테고리 정렬
                    question.getCategories().sort(Comparator.comparingInt(GridCategoryDTO::getCategoryOrder));
                }
            }
        }
          
        model.addAttribute("survey", survey);
        
        
        return "form/response";
    }
    
    //수정 페이지
    @GetMapping("/update.do")
    public String showUpdatePage(@RequestParam Long id, Model model) {
        SurveyDTO survey = surveyService.getSurveyById(id);                        
        model.addAttribute("survey", survey);
        return "form/update";  
    }    
    
    
    


    
}