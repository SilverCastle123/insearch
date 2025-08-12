package com.init.survey.service.impl;

import org.springframework.stereotype.Service;

import com.init.survey.dto.SurveyResponseExcelDTO;
import com.init.survey.repository.ResponseItemRepository;
import com.init.survey.service.SurveyExcelService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyExcelServiceImpl implements SurveyExcelService {

    private final ResponseItemRepository responseItemRepository;

    @Override
    public List<SurveyResponseExcelDTO> getExcelData(Long surveyId) {
        List<SurveyResponseExcelDTO> rawData = responseItemRepository.findExcelDataBySurveyId(surveyId);

        // answer 필드 파싱 및 가공
        rawData.forEach(dto -> {
            String parsedAnswer = parseAnswer(dto.getAnswer());
            dto.setAnswer(parsedAnswer);
        });

        return rawData;
    }

    // answer 파싱 메서드
    private String parseAnswer(String answer) {
        if (answer == null || answer.isEmpty()) {
            return "";
        }

        if (answer.matches("\\d+:.*")) { // 그리드 형식: "숫자:값"
            String[] parts = answer.split(":", 2);
            String categoryOrder = parts[0];
            String value = parts[1];
            return String.format("그리드형 (카테고리순서:%s) - %s", categoryOrder, value);
        }

        if (answer.matches("\\d+")) { // 객관식 choiceId
            return "객관식 choiceId: " + answer;
        }

        // 주관식 텍스트
        return answer;
    }
}