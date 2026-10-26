package com.leaveflow;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveRequestController {
    private final LeaveRequestRepository repository;

    public LeaveRequestController(LeaveRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "application", "LeaveFlow API");
    }

    @GetMapping("/leaves")
    public List<LeaveRequest> getAll() {
        return repository.findAll();
    }

    @GetMapping("/leaves/{id}")
    public LeaveRequest getOne(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found"));
    }

    @PostMapping("/leaves")
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequest create(@Valid @RequestBody LeaveRequestInput input) {
        if (input.getEndDate().isBefore(input.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
        LeaveRequest request = new LeaveRequest();
        request.setEmployeeName(input.getEmployeeName().trim());
        request.setEmployeeEmail(input.getEmployeeEmail().trim().toLowerCase());
        request.setLeaveType(input.getLeaveType());
        request.setStartDate(input.getStartDate());
        request.setEndDate(input.getEndDate());
        request.setReason(input.getReason().trim());
        request.setStatus(LeaveStatus.PENDING);
        return repository.save(request);
    }

    @PatchMapping("/leaves/{id}/status")
    public LeaveRequest updateStatus(@PathVariable Long id, @Valid @RequestBody StatusInput input) {
        LeaveRequest request = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found"));
        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only pending requests can be reviewed");
        }
        if (input.status() != LeaveStatus.APPROVED && input.status() != LeaveStatus.REJECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be APPROVED or REJECTED");
        }
        request.setStatus(input.status());
        return repository.save(request);
    }

    public record StatusInput(@jakarta.validation.constraints.NotNull LeaveStatus status) {}
}
