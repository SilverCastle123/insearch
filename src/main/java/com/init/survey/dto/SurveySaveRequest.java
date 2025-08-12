package com.init.survey.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveySaveRequest {

    @NotBlank(message = "설문 제목은 필수입니다.")
    private String title;

    private String description;
    
    private LocalDate closingDate;
    
    private String closingMessage;

    @NotNull
    @Size(min = 1, message = "최소 1개의 문항이 필요합니다.")
    private List<QuestionDTO> questions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDTO {
    	private Integer id; 
    	
        @NotNull
        private Integer questionOrder;

        @NotBlank
        private String type;

        @NotBlank
        private String content;
        
        private List<ChoiceDTO> choices;
        
        // 그리드 문항용 필드
        private String scaleType;
        private Integer scaleSize;
        private List<GridCategoryDTO> categories;
        
        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class ChoiceDTO {
        	private Integer id; 

        	private Integer choiceOrder;
            @NotBlank
            private String content;
            
            public ChoiceDTO(Integer choiceOrder, String content) {
                this.choiceOrder = choiceOrder;
                this.content = content;
            }

           
        }
        
        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class GridCategoryDTO {
        	private Integer id; 
            private Integer categoryOrder;

            @NotBlank
            private String content;
            
            public GridCategoryDTO(Integer categoryOrder, String content) {
                this.categoryOrder = categoryOrder;
                this.content = content;
            }
        }
    }
    
    
}