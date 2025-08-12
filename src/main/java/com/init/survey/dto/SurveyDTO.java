package com.init.survey.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.init.survey.dto.SurveySaveRequest.QuestionDTO.ChoiceDTO;
import com.init.survey.dto.SurveySaveRequest.QuestionDTO.GridCategoryDTO;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyDTO {
    private Long id;
    private String title;
    private String description;
    private String closingMessage;
    private LocalDate closingDate;
    private LocalDateTime createdAt;
    private List<QuestionDTO> questions;
    
    
    
    @Getter @Setter @Builder
    public static class QuestionDTO {
    	private Long id;
        private int questionOrder;
        private String type;
        private String content;                
        private String scaleType;
        private Integer scaleSize;
        
        private List<ChoiceDTO> choices;
        private List<GridCategoryDTO> categories;
    }
    
    public String getCreatedAtFormatted() {
        if (createdAt == null) {
            return "";
        }
        return createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
    


    public String getClosingDateStr() {
        return closingDate != null
            ? closingDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            : "";
    }

}
