package com.init.survey.service.impl;

import com.init.survey.service.SurveyResponseService;
import com.init.survey.repository.SurveyResponseRepository;
import com.init.survey.repository.SurveyRepository;
import com.init.survey.entity.SurveyResponse;
import com.init.survey.entity.GridCategory;
import com.init.survey.entity.Question;
import com.init.survey.entity.ResponseItem;
import com.init.survey.entity.Survey;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import javax.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SurveyResponseServiceImpl implements SurveyResponseService {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository surveyResponseRepository;

    @Override
    public void saveSurveyResponse(HttpServletRequest request) {
        Long surveyId = Long.valueOf(request.getParameter("surveyId"));
        Survey survey = surveyRepository.findByIdWithQuestionsAndChoices(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        SurveyResponse response = new SurveyResponse();
        response.setSurveyId(surveyId);
        response.setSubmittedAt(LocalDateTime.now());

        String[] questionIds = request.getParameterValues("questionIdList");
        if (questionIds != null) {
            for (String qidStr : questionIds) {
                Long qid = Long.valueOf(qidStr);
                Question q = survey.getQuestions().stream()
                        .filter(qq -> qq.getId().equals(qid))
                        .findFirst().orElse(null);
                if (q == null) continue;

                if ("grid".equals(q.getType())) {
                    for (GridCategory cat : q.getGridCategories()) {
                        String paramName = "q_" + q.getId() + "_" + cat.getCategoryOrder();
                        String val = request.getParameter(paramName);
                        if (val != null) {
                            ResponseItem item = new ResponseItem();
                            item.setQuestionId(q.getId());
                            item.setCategoryOrder(cat.getCategoryOrder());
                            item.setAnswer(val);
                            response.addResponseItem(item);
                        }
                    }
                } else {
                    String paramName = "q_" + q.getId();
                    String val = request.getParameter(paramName);
                    if (val != null && !val.trim().isEmpty()) {
                        ResponseItem item = new ResponseItem();
                        item.setQuestionId(q.getId());
                        item.setAnswer(val);
                        response.addResponseItem(item);
                    }
                }
            }
        }

        surveyResponseRepository.save(response);
    }
    
    @Override
    public List<SurveyResponse> getResponsesBySurveyId(Long surveyId) {
        return surveyResponseRepository.findBySurveyIdWithItems(surveyId);
    }
}
