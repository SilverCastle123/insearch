package com.init.survey.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "SVY_CHOICE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "choice_seq_gen")
    @SequenceGenerator(name = "choice_seq_gen", sequenceName = "CHOICE_SEQ", allocationSize = 1)
    private Long id;
    
    @Column(name = "choice_order")
    private Integer choiceOrder;

    @Column(length = 1000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
}
