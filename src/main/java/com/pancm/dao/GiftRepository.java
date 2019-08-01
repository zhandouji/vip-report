package com.pancm.dao;

import com.pancm.pojo.entity.GiftEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftRepository extends JpaRepository<GiftEntity, Integer> {
}
