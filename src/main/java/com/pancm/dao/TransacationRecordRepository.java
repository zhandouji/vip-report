package com.pancm.dao;

import com.pancm.pojo.entity.TransactionRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacationRecordRepository extends JpaRepository<TransactionRecordEntity, Integer> {

    List<TransactionRecordEntity> findAllByMemberIdOrderByCreateTimeDesc(int memberId);

    List<TransactionRecordEntity> findAllByMobileOrderByCreateTimeDesc(String phone);

}
