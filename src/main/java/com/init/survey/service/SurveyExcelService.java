package com.init.survey.service;

import java.util.List;
import com.init.survey.dto.SurveyResponseExcelDTO;

public interface SurveyExcelService {
    List<SurveyResponseExcelDTO> getExcelData(Long surveyId);
}
