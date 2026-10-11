package com.employee.management.controller;

import com.employee.management.model.Employee;
import com.employee.management.repository.EmployeeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000",
    "https://soundaryakalavant-create.github.io"
})
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    // Get employee by code
    @GetMapping("/{code}")
    public ResponseEntity<?> getEmployee(@PathVariable String code) {
        return employeeRepository.findByCode(code)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Employee not found")));
    }

    // Add new employee
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {

        if (employee.getCode() == null ||
                employee.getCode().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Employee code is required"));
        }

        if (employeeRepository.existsByCode(employee.getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Employee code already exists"));
        }

        Employee savedEmployee = employeeRepository.save(employee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedEmployee);
    }

    // Update employee
    @PutMapping("/{code}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String code,
            @RequestBody Employee updated) {

        return employeeRepository.findByCode(code).<ResponseEntity<?>>map(employee -> {

            // Check duplicate code if changed
            String newCode = updated.getCode();

            if (newCode == null || newCode.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Employee code is required"));
            }

            if (!code.equals(newCode)
                    && employeeRepository.existsByCode(newCode)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Employee code already exists"));
            }

            employee.setCode(newCode);
            employee.setEmployeeName(updated.getEmployeeName());
            employee.setDateOfBirth(updated.getDateOfBirth());
            employee.setEmailAddress(updated.getEmailAddress());
            employee.setAddress1(updated.getAddress1());
            employee.setAddress2(updated.getAddress2());
            employee.setCity(updated.getCity());
            employee.setState(updated.getState());
            employee.setPhoneNumber(updated.getPhoneNumber());
            employee.setEmergencyNumber(updated.getEmergencyNumber());
            employee.setPanNumber(updated.getPanNumber());
            employee.setTaxStatus(updated.getTaxStatus());
            employee.setGender(updated.getGender());

            Employee savedEmployee = employeeRepository.save(employee);

            return ResponseEntity.ok(savedEmployee);

        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Employee not found")));
    }

    // Delete employee
    @DeleteMapping("/{code}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String code) {

        return employeeRepository.findByCode(code).<ResponseEntity<?>>map(employee -> {
            employeeRepository.delete(employee);

            return ResponseEntity.ok(
                    Map.of("message", "Employee deleted successfully"));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Employee not found")));
    }
}