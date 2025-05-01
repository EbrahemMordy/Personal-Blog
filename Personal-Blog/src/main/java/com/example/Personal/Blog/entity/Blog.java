package com.example.Personal.Blog.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "Blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @CreationTimestamp
    @Column(name = "date", updatable = false)
    private Date createdAt;

    @Column(name = "content")
    private String content;

    public Blog(int id, String name, Date createdAt, String content) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.content = content;
    }

    public Blog() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Blog{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createdAt=" + createdAt +
                ", content='" + content + '\'' +
                '}';
    }
}
