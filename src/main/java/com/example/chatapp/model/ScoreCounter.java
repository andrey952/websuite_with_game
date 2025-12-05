package com.example.chatapp.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreCounter {
    private long wins;
    private long losses;
    private long ties;
}   