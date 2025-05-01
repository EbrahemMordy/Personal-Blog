package com.example.Personal.Blog.service.implementation;

import com.example.Personal.Blog.entity.Blog;
import com.example.Personal.Blog.repository.BlogRepository;
import com.example.Personal.Blog.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    @Autowired
    public BlogServiceImpl(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Optional<Blog> getBlogByID(int id) {
        return blogRepository.findById(id);
    }

    @Override
    public Blog addBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public Blog updateBlog(int id, Blog blogRequest) {
        Blog existing = blogRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Blog with id " + id + " does not exist"));
        if (blogRequest.getName() != null) {
            existing.setName(blogRequest.getName());
        }
        if (blogRequest.getCreatedAt() != null) {
            existing.setCreatedAt(blogRequest.getCreatedAt());
        }
        if (blogRequest.getContent() != null) {
            existing.setContent(blogRequest.getContent());
        }
        return blogRepository.save(existing);
    }

    @Override
    public void deleteBlogByID(int id) {
        blogRepository.deleteById(id);
    }
}
