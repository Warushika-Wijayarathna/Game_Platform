package com.zenova.back_end.entity;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.io.Serializable;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "games")
    public class Game implements Serializable {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        private String description;

        @ManyToOne
        @JoinColumn(name = "category_id")
        private Category category;

        private String rules;
        private String price;
        private String image;
        private String hostedUrl;
        private boolean active;
        @ManyToOne
        @JoinColumn(name = "uploaded_by_uid")
        private User uploadedBy;
        private Boolean isApproved;
    }
