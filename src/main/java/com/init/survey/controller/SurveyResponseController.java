package com.init.survey.controller;

import com.init.survey.entity.Choice;
import com.init.survey.entity.GridCategory;
import com.init.survey.entity.Question;
import com.init.survey.entity.ResponseItem;
import com.init.survey.entity.Survey;
import com.init.survey.entity.SurveyResponse;
import com.init.survey.service.SurveyResponseService;
import com.init.survey.service.SurveyService;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.List;


@Controller
@RequiredArgsConstructor
public class SurveyResponseController {

    private final SurveyService surveyService;
    private final SurveyResponseService surveyResponseService;

    @GetMapping("/response.do")
    public String showResponseForm(@RequestParam("id") Long id, Model model) {
        Survey survey = surveyService.findSurveyWithQuestions(id);
        
        List<Question> sortedQuestions = survey.getQuestions().stream()
        	    .sorted(Comparator.comparingInt(Question::getQuestionOrder))
        	    .collect(Collectors.toList());
        
        model.addAttribute("survey", survey);
        model.addAttribute("sortedQuestions", sortedQuestions);
        return "form/response";
    }

    @PostMapping("/submitResponse.do")
    public String submitSurveyResponse(HttpServletRequest request, RedirectAttributes redirectAttributes) {
        surveyResponseService.saveSurveyResponse(request);
        redirectAttributes.addFlashAttribute("message", "응답이 저장되었습니다. 감사합니다.");
        return "redirect:/main.do";
    }
    
    @GetMapping("/survey/{surveyId}/responses/excel")
    public void downloadSurveyResponsesExcel(@PathVariable Long surveyId, HttpServletResponse response) throws IOException {
    	Survey survey = surveyService.findSurveyWithQuestions(surveyId);
    	
    	List<SurveyResponse> responses = surveyResponseService.getResponsesBySurveyId(surveyId);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("응답 결과");

        int rowNum = 0;
        Row header = sheet.createRow(rowNum++);
        header.createCell(0).setCellValue("응답자 순번");
        header.createCell(1).setCellValue("응답 ID");
        header.createCell(2).setCellValue("제출 시간");
        header.createCell(3).setCellValue("질문 ID");
        header.createCell(4).setCellValue("카테고리 순서");
        header.createCell(5).setCellValue("응답 내용");

        int index = 1; // 응답자 번호
        for (SurveyResponse sr : responses) {
            for (ResponseItem item : sr.getResponseItems()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(index);
                row.createCell(1).setCellValue(sr.getId());
                row.createCell(2).setCellValue(sr.getSubmittedAt().toString());
                row.createCell(3).setCellValue(item.getQuestionId());
                row.createCell(4).setCellValue(item.getCategoryOrder() != null ? item.getCategoryOrder() : -1);
                row.createCell(5).setCellValue(item.getAnswer());
            }
            index++;
        }
        
        // 파일명에 설문 제목 포함 (공백, 특수문자 제거)
        String fileName = survey.getTitle().replaceAll("[\\\\/:*?\"<>|\\s]", "_");
        String encodedFileName = java.net.URLEncoder.encode(fileName, "UTF-8");

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=" + encodedFileName + "_responses.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }


}
