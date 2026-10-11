package com.employee.management.repository;

import com.employee.management.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByCode(String code);
    boolean existsByCode(String code);
}
