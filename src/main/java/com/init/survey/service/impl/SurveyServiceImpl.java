package com.init.survey.service.impl;

import com.init.survey.dto.SurveyDTO;
import com.init.survey.dto.SurveySaveRequest;
import com.init.survey.dto.SurveySaveRequest.QuestionDTO.ChoiceDTO;
import com.init.survey.dto.SurveySaveRequest.QuestionDTO.GridCategoryDTO;
import com.init.survey.entity.Choice;
import com.init.survey.entity.GridCategory;
import com.init.survey.entity.Question;
import com.init.survey.entity.Survey;
import com.init.survey.repository.QuestionRepository;
import com.init.survey.repository.SurveyRepository;
import com.init.survey.service.SurveyService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {

    private final SurveyRepository surveyRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SurveyDTO> getAllSurveys() {
    	List<Survey> surveys = surveyRepository.findAll();
    	
        // 강제로 질문 컬렉션 초기화 (Hibernate 세션 내에서)
        surveys.forEach(survey -> survey.getQuestions().size());
    	
        return surveyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<SurveyDTO> getSurveysPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return surveyRepository.findAll(pageable).map(this::convertToDTO);
    }


    @Override
    public SurveyDTO getSurveyById(Long id) {
        return surveyRepository.findWithQuestionsById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public SurveyDTO createSurvey(SurveyDTO dto) {
        Survey survey = Survey.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .closingMessage(dto.getClosingMessage())
                .createdAt(LocalDateTime.now())
                .build();
        return convertToDTO(surveyRepository.save(survey));
    }

    @Override
    public void deleteSurvey(Long id) {
        surveyRepository.deleteById(id);
    }
    
    //검색기능
    @Transactional(readOnly = true)
    public Page<SurveyDTO> searchSurveys(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Survey> surveyPage = surveyRepository.findByTitleContainingIgnoreCase(keyword, pageable);

        // 연관 컬렉션 강제 초기화
        surveyPage.getContent().forEach(survey -> survey.getQuestions().size());

        // 변환
        return surveyPage.map(this::convertToDTO);
    }
    
    //저장기능
    @Override
    @Transactional
    public void saveSurveyWithQuestions(SurveySaveRequest request) {
        Survey survey = Survey.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .closingMessage(request.getClosingMessage())
                .closingDate(request.getClosingDate())
                .createdAt(LocalDateTime.now())
                .build();

        Set<Question> questions = request.getQuestions().stream()
        	    .map(q -> {
        	        Question question = Question.builder()
        	            .questionOrder(q.getQuestionOrder())
        	            .type(q.getType())
        	            .content(q.getContent())
        	            .survey(survey)
        	            .build();

        	        // 선택형 문항일 경우 보기 추가
        	        if ((q.getType().equals("objectV") || q.getType().equals("objectH"))
        	                && q.getChoices() != null) {
        	            Set<Choice> choices = q.getChoices().stream()
        	                    .map(choiceDTO -> Choice.builder()
        	                            .choiceOrder(choiceDTO.getChoiceOrder() != null ? choiceDTO.getChoiceOrder() : 0)
        	                            .content(choiceDTO.getContent())
        	                            .question(question)
        	                            .build())
        	                    .collect(Collectors.toSet());
        	            question.setChoices(choices);
        	        }                
        	     // 그리드 문항 처리
        	        else if ("grid".equals(q.getType())) {
        	            question.setScaleType(q.getScaleType());
        	            question.setScaleSize(q.getScaleSize());

        	            if (q.getCategories() != null) {
        	                Set<GridCategory> categories = q.getCategories().stream()
        	                    .map(catDTO -> GridCategory.builder()
        	                        .categoryOrder(catDTO.getCategoryOrder())
        	                        .content(catDTO.getContent())
        	                        .question(question)
        	                        .build())
        	                    .collect(Collectors.toSet());

        	                question.setGridCategories(categories);
        	            }
        	        }

        	        return question;
        	    })
        	    .collect(Collectors.toSet());

        survey.setQuestions(questions);
        surveyRepository.save(survey); // cascade로 question, choice도 함께 저장됨
    }

    private SurveyDTO convertToDTO(Survey survey) {
        return SurveyDTO.builder()
                .id(survey.getId())
                .title(survey.getTitle())
                .description(survey.getDescription())
                .closingMessage(survey.getClosingMessage())
                .closingDate(survey.getClosingDate())
                .createdAt(survey.getCreatedAt())
                .questions(
                        survey.getQuestions().stream()
                                .map(q -> SurveyDTO.QuestionDTO.builder()
                                		.id(q.getId())
                                        .questionOrder(q.getQuestionOrder())
                                        .type(q.getType())
                                        .content(q.getContent())
                                        .scaleType(q.getScaleType())
                                        .scaleSize(q.getScaleSize())
                                        .choices(q.getChoices() != null ?
                                                q.getChoices().stream()
                                                        .map(c -> new ChoiceDTO(c.getChoiceOrder(), c.getContent()))
                                                        .collect(Collectors.toList()) : null)
                                        .categories(q.getGridCategories() != null ?
                                                q.getGridCategories().stream()
                                                        .map(cat -> new GridCategoryDTO(cat.getCategoryOrder(), cat.getContent()))
                                                        .collect(Collectors.toList()) : null)
                                        .build())
                                .collect(Collectors.toList())
                )
                .build();
    }

    
    //수정
    @Override
    @Transactional
    public void updateSurvey(Long id, SurveySaveRequest request) {
        Survey existingSurvey = surveyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 설문이 존재하지 않습니다. id=" + id));

        // 기본 정보 수정
        existingSurvey.setTitle(request.getTitle());
        existingSurvey.setDescription(request.getDescription());
        existingSurvey.setClosingMessage(request.getClosingMessage());
        existingSurvey.setClosingDate(request.getClosingDate());

     
        // 안전하게 기존 질문, 선택지, 그리드 카테고리 모두 삭제 처리
        if (existingSurvey.getQuestions() != null) {
            existingSurvey.getQuestions().forEach(q -> {
                if (q.getChoices() != null) {
                    q.getChoices().clear();
                }
                if (q.getGridCategories() != null) {
                    q.getGridCategories().clear();
                }
            });
            existingSurvey.getQuestions().clear();
        }

        // 새 질문들 생성
        Set<Question> questions = request.getQuestions().stream()
                .map(q -> {
                    Question question = Question.builder()
                            .questionOrder(q.getQuestionOrder())
                            .type(q.getType())
                            .content(q.getContent())
                            .scaleType(q.getScaleType())
                            .scaleSize(q.getScaleSize())
                            .survey(existingSurvey)
                            .build();

                    if ((q.getType().equals("objectV") || q.getType().equals("objectH"))
                            && q.getChoices() != null) {
                        Set<Choice> choices = q.getChoices().stream()
                                .map(choiceDTO -> Choice.builder()
                                        .choiceOrder(choiceDTO.getChoiceOrder() != null ? choiceDTO.getChoiceOrder() : 0)
                                        .content(choiceDTO.getContent())
                                        .question(question)
                                        .build())
                                .collect(Collectors.toSet());
                        question.setChoices(choices);
                    }

                    if ("grid".equals(q.getType())) {
                        if (q.getCategories() != null) {
                            Set<GridCategory> categories = q.getCategories().stream()
                                    .map(catDTO -> GridCategory.builder()
                                            .categoryOrder(catDTO.getCategoryOrder())
                                            .content(catDTO.getContent())
                                            .question(question)
                                            .build())
                                    .collect(Collectors.toSet());
                            question.setGridCategories(categories);
                        }
                    }

                    return question;
                })
                .collect(Collectors.toSet());

        existingSurvey.getQuestions().clear();
        existingSurvey.getQuestions().addAll(questions);

        // 변경내용 저장 (Cascade 옵션에 의해 질문, 선택지, 카테고리도 저장)
        surveyRepository.save(existingSurvey);
    }

    @Override
    @Transactional(readOnly = true)
    public Survey findSurveyWithQuestions(Long id) {
        return surveyRepository.findByIdWithQuestionsAndChoices(id)
                .orElseThrow(() -> new IllegalArgumentException("설문을 찾을 수 없습니다. id=" + id));
    }
    
 

    
    
}
