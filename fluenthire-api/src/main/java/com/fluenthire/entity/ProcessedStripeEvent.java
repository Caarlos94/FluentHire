package com.fluenthire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "processed_stripe_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessedStripeEvent {

    @Id
    @Column(length = 255)
    private String eventId;

    @Column(nullable = false)
    private String eventType;

    @CreationTimestamp
    private LocalDateTime processedAt;
}
