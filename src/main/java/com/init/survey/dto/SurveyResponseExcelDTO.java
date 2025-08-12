package com.init.survey.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class SurveyResponseExcelDTO {
    private String surveyTitle;
    private int questionOrder;
    private String questionContent;
    private String respondent; // 응답자 식별
    private String answer;     // 최종 응답 내용
}

