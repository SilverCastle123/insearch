package com.init.survey.controller;

import com.init.survey.dto.SurveyResponseExcelDTO;
import com.init.survey.entity.Choice;
import com.init.survey.entity.GridCategory;
import com.init.survey.entity.Question;
import com.init.survey.entity.ResponseItem;
import com.init.survey.entity.Survey;
import com.init.survey.entity.SurveyResponse;
import com.init.survey.service.SurveyExcelService;
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.List;


@Controller
@RequiredArgsConstructor
public class SurveyResponseController {

    private final SurveyService surveyService;
    private final SurveyResponseService surveyResponseService;
    private final SurveyExcelService surveyExcelService;

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
        List<SurveyResponseExcelDTO> excelData = surveyExcelService.getExcelData(surveyId);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String fileName = URLEncoder.encode("survey_response.xlsx", "UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Survey Responses");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"설문 제목", "문항 순서", "문항 내용", "응답자", "응답"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (SurveyResponseExcelDTO dto : excelData) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dto.getSurveyTitle());
                row.createCell(1).setCellValue(dto.getQuestionOrder());
                row.createCell(2).setCellValue(dto.getQuestionContent());
                row.createCell(3).setCellValue(dto.getRespondent());
                row.createCell(4).setCellValue(dto.getAnswer());  // 이미 파싱된 값
            }

            workbook.write(response.getOutputStream());
        }
    }
    


}
