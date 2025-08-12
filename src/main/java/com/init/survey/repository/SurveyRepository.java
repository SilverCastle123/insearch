package com.init.survey.repository;


import com.init.survey.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
	
    // 페이징 조회 시 questions와 하위 choices, gridCategories도 같이 fetch
    @EntityGraph(attributePaths = {"questions", "questions.choices", "questions.gridCategories"})
    Page<Survey> findAll(Pageable pageable);
	
    // ID로 조회 시 questions 및 하위 컬렉션 fetch (필드명 맞춤)
    @EntityGraph(attributePaths = {"questions", "questions.choices", "questions.gridCategories"})
    Optional<Survey> findById(Long id);
    
    // ID로 조회 시 questions 및 하위 컬렉션 fetch
    @EntityGraph(attributePaths = {"questions", "questions.choices", "questions.gridCategories"})
    Optional<Survey> findWithQuestionsById(Long id);    
    
    @Query("SELECT s FROM Survey s " +
            "LEFT JOIN FETCH s.questions q " +
            "LEFT JOIN FETCH q.choices " +
            "LEFT JOIN FETCH q.gridCategories " +
            "WHERE s.id = :id")
     Optional<Survey> findByIdWithQuestionsAndChoices(@Param("id") Long id);
    
    // 제목에 키워드가 포함된 설문 검색
    Page<Survey> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
 


}