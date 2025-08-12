package com.init.survey.repository;

import com.init.survey.entity.ResponseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseItemRepository extends JpaRepository<ResponseItem, Long> {
}
