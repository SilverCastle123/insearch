package com.init.survey.entity;

import javax.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "SVY_SURVEYS")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "survey_seq_gen")
    @SequenceGenerator(name = "survey_seq_gen", sequenceName = "SURVEY_SEQ", allocationSize = 1)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;
    
    @Column(name = "CLOSING_MESSAGE")
    private String closingMessage;
    
    @Column(name = "CLOSING_DATE")
    private LocalDate closingDate;

    private LocalDate createdAt;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions = new HashSet<>();
    
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyResponse> surveyResponses = new ArrayList<>();
}
