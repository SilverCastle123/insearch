package com.init.survey.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "SVY_RESPONSE_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "responseitem_seq_gen")
    @SequenceGenerator(name = "responseitem_seq_gen", sequenceName = "RESPONSEITEM_SEQ", allocationSize = 1)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private String answer; // 객관식: choiceId, 주관식: text, 그리드: "categoryOrder:value" 형식
    
    private Integer categoryOrder; // 그리드형에만 해당 (null 가능)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_response_id")
    private SurveyResponse surveyResponse;
    

    
    
}
