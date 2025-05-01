package com.example.Personal.Blog.service;

import com.example.Personal.Blog.entity.Blog;

import java.util.List;
import java.util.Optional;

public interface BlogService {
    List<Blog> getAllBlogs();

    Optional<Blog> getBlogByID(int id);

    Blog addBlog(Blog blog);

    Blog updateBlog(int id, Blog blogRequest);

    void deleteBlogByID(int id);
}
