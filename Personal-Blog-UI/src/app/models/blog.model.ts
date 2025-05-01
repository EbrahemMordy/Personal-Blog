export interface Blog {
  id: number;
  name: string;
  content: string;
  createdDate: any; // Changed from Date to any to handle various date formats
}

// Helper function to convert a blog from the API to our model
export function convertBlog(blogData: any): Blog {
  // Log the raw data for debugging
  console.log('Converting blog data:', blogData);
  
  // Handle Spring Boot's ISO 8601 date format (2025-05-01T03:00:39.000+00:00)
  let createdDate = blogData.createdAt || blogData.createdDate;
  
  // Log the raw date value for debugging
  console.log('Raw date from API:', createdDate, 'type:', typeof createdDate);
  
  // Return a properly formatted blog object
  return {
    id: blogData.id,
    name: blogData.name,
    content: blogData.content,
    createdDate: createdDate
  };
}

// Helper function to format a date properly
export function formatBlogDate(date: any): string {
  if (!date) return 'Unknown date';
  
  try {
    // For ISO 8601 string format from Spring Boot (2025-05-01T03:00:39.000+00:00)
    if (typeof date === 'string') {
      // Parse ISO string directly
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    // For Date objects
    else if (date instanceof Date) {
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    // If we got here, we couldn't parse the date
    console.warn('Could not parse date format:', JSON.stringify(date));
    return 'Unknown date';
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Error parsing date';
  }
} 