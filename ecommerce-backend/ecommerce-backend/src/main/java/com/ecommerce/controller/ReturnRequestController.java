package com.ecommerce.controller;

import com.ecommerce.dto.ReturnRequestDTO;
import com.ecommerce.model.ReturnRequest;
import com.ecommerce.service.ReturnRequestService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnRequestController {

    private final ReturnRequestService service;

    // USER gửi yêu cầu
    @PostMapping("/request")
    public ReturnRequest createRequest(
            @RequestParam Long userId,
            @RequestBody ReturnRequestDTO dto
    ) {
        return service.create(userId, dto);
    }

    // ADMIN duyệt yêu cầu
    @PostMapping("/{id}/approve")
    public ReturnRequest approve(
            @PathVariable Long id,
            @RequestParam String note
    ) {
        return service.approve(id, note);
    }

    // ADMIN từ chối
    @PostMapping("/{id}/reject")
    public ReturnRequest reject(
            @PathVariable Long id,
            @RequestParam String note
    ) {
        return service.reject(id, note);
    }
}
