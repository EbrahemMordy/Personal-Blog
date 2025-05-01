package com.example.Personal.Blog.controller;

import com.example.Personal.Blog.entity.Blog;
import com.example.Personal.Blog.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("")
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/{id}")
    public Blog getBlogByID(@PathVariable int id) {
        return blogService.getBlogByID(id).orElse(null);
    }

    @PostMapping("/new")
    public Blog addBlog(@RequestBody Blog blog) {
        return blogService.addBlog(blog);
    }

    @PutMapping("/update/{id}")
    public Blog updateBlog(@PathVariable int id, @RequestBody Blog blog) {
        return blogService.updateBlog(id, blog);
    }

    @DeleteMapping("delete/{id}")
    public void deleteBlogByID(@PathVariable int id) {
        blogService.deleteBlogByID(id);
    }
}

