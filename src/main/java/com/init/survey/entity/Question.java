package com.init.survey.entity;

import javax.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "SVY_QUESTION")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_seq_gen")
    @SequenceGenerator(name = "question_seq_gen", sequenceName = "QUESTION_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "question_order")
    private int questionOrder;

    private String type;

    @Column(length = 1000)
    private String content;
    
    // 그리드 문항 관련 필드
    private String scaleType; // agree, satisfy, truth
    private Integer scaleSize; // 5, 7


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id")
    private Survey survey;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Choice> choices = new HashSet<>();
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GridCategory> gridCategories = new HashSet<>();
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseItem> responseItems = new ArrayList<>();
    
    
    // 정렬된 Choice 리스트 반환
    public List<Choice> getSortedChoiceList() {
        return choices.stream()
                .sorted(Comparator.comparingInt(Choice::getChoiceOrder))
                .collect(Collectors.toList());
    }

    // 정렬된 GridCategory 리스트 반환
    public List<GridCategory> getSortedGridCategoryList() {
        return gridCategories.stream()
                .sorted(Comparator.comparingInt(GridCategory::getCategoryOrder))
                .collect(Collectors.toList());
    }

}
