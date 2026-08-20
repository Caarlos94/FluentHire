package com.fluenthire.repository;

import com.fluenthire.entity.CreditTransaction;
import com.fluenthire.entity.CreditTransactionType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CreditTransactionRepository extends JpaRepository<CreditTransaction, Long> {

    List<CreditTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    int countByTypeAndCreatedAtBetween(CreditTransactionType type, LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(ct.amount), 0) FROM CreditTransaction ct WHERE ct.type = :type AND ct.createdAt BETWEEN :from AND :to")
    int sumAmountByTypeAndCreatedAtBetween(@Param("type") CreditTransactionType type, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    void deleteByUserId(Long id);
}
