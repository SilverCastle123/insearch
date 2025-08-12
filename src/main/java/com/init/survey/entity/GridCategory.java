package com.init.survey.entity;

import javax.persistence.*;
import lombok.*;

@Entity
@Table(name = "SVY_GRIDCATEGORY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GridCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE) // Oracle이면 SEQUENCE도 가능
    private Long id;

    @Column(name = "CATEGORY_ORDER")
    private int categoryOrder;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_ID", nullable = false)
    private Question question;
}
