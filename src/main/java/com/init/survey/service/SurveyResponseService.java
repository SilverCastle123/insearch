package com.init.survey.service;

import java.util.List;
import com.init.survey.entity.SurveyResponse;
import javax.servlet.http.HttpServletRequest;

public interface SurveyResponseService {
	 void saveSurveyResponse(HttpServletRequest request);
	 
	 List<SurveyResponse> getResponsesBySurveyId(Long surveyId);
	 
	 
}
