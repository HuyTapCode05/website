package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String slug;

    private String description;

    private boolean active = true;

    // === Danh mục cha ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    // === Danh mục con ===
    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<Category> children;
}
