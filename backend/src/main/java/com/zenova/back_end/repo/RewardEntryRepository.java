package com.zenova.back_end.repo;

import com.zenova.back_end.entity.RewardEntry;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RewardEntryRepository extends JpaRepository<RewardEntry, Long> {
    @Query("SELECT re FROM RewardEntry re WHERE re.user.uid = :userId AND re.weekStartDate = :weekStartDate")
    List<RewardEntry> findByUserIdAndWeekStartDate(@Param("userId") String userId, @Param("weekStartDate") LocalDate weekStartDate);

    @Query("SELECT re FROM RewardEntry re WHERE re.user.uid = :userId AND re.weekStartDate = :weekStartDate AND re.dayOfWeek = :dayOfWeek")
    RewardEntry findByUserIdAndWeekStartDateAndDayOfWeek(@Param("userId") String userId, @Param("weekStartDate") LocalDate weekStartDate, @Param("dayOfWeek") int dayOfWeek);
}
