package com.init.survey.entity;

import lombok.*;
import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SVY_RESPONSE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "response_seq_gen")
    @SequenceGenerator(name = "response_seq_gen", sequenceName = "RESPONSE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "survey_id")
    private Long surveyId;

    private LocalDateTime submittedAt;
    
    private String respondentName;  
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", insertable = false, updatable = false)
    private Survey survey;

    @OneToMany(mappedBy = "surveyResponse", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseItem> responseItems = new ArrayList<>();

    public void addResponseItem(ResponseItem item) {
        item.setSurveyResponse(this);
        this.responseItems.add(item);
    }
}
