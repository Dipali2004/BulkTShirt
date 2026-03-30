package com.bulkplaintshirt.core.controller;

import com.bulkplaintshirt.core.model.Enquiry;
import com.bulkplaintshirt.core.repository.EnquiryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/enquiries")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;
    private final JavaMailSender mailSender;

    public EnquiryController(EnquiryRepository enquiryRepository, JavaMailSender mailSender) {
        this.enquiryRepository = enquiryRepository;
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username}")
    private String companyMail;

    @PostMapping
    public ResponseEntity<Enquiry> submitEnquiry(@RequestBody Enquiry enquiry) {
        enquiry.setSubmittedAt(LocalDateTime.now());
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        // Send mail to company
        sendEmail(companyMail, "New Enquiry from " + savedEnquiry.getName(),
                "Details:\nName: " + savedEnquiry.getName() +
                        "\nEmail: " + savedEnquiry.getEmail() +
                        "\nPhone: " + savedEnquiry.getPhoneNumber() +
                        "\nMessage: " + savedEnquiry.getMessage());

        // Send mail to user
        sendEmail(savedEnquiry.getEmail(), "Enquiry Received - Bulk Plain T-Shirt",
                "Hi " + savedEnquiry.getName() + ",\n\nWe have received your enquiry. Our team will get back to you soon.\n\nThank you!");

        return ResponseEntity.ok(savedEnquiry);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(companyMail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
