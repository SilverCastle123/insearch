package com.init.survey.repository;

import com.init.survey.entity.SurveyResponse;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
	
	@Query("SELECT DISTINCT sr FROM SurveyResponse sr LEFT JOIN FETCH sr.responseItems WHERE sr.surveyId = :surveyId")
    List<SurveyResponse> findBySurveyIdWithItems(@Param("surveyId") Long surveyId);
}
