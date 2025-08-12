package com.init.survey.repository;

import com.init.survey.dto.SurveyResponseExcelDTO;
import com.init.survey.entity.ResponseItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResponseItemRepository extends JpaRepository<ResponseItem, Long> {
	
	
	
	@Query("SELECT new com.init.survey.dto.SurveyResponseExcelDTO(" +
		       "sr.survey.title, " +
		       "q.questionOrder, " +
		       "q.content, " +
		       "sr.respondentName, " +
		       "ri.answer " +
		       ") " +
		       "FROM ResponseItem ri " +
		       "JOIN ri.surveyResponse sr " +
		       "JOIN ri.question q " +
		       "WHERE sr.survey.id = :surveyId " +
		       "ORDER BY q.questionOrder ASC")
		List<SurveyResponseExcelDTO> findExcelDataBySurveyId(@Param("surveyId") Long surveyId);
}
