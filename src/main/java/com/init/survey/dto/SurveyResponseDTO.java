package com.init.survey.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponseDTO {
    private Long responseId;
    private String respondent;   // 응답자 정보
    private LocalDateTime submittedAt;

    private List<QuestionAnswerDTO> answers;

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionAnswerDTO {
        private String questionContent;
        private String answerContent;
    }
}
