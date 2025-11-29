export let blogData = [
  {
    id: 1,
    title: "Understanding JSX in React",
    paragraph:
      "JSX is a syntax extension for JavaScript, commonly used with React to describe what the UI should look like. It allows you to write HTML-like code within JavaScript, making it easier to create and visualize the structure of the user interface.",
    comments: [
      {
        user: "Alice",
        comment:
          "Great explanation! JSX makes it so much easier to write React components.",
      },
      {
        user: "Bob",
        comment:
          "Thanks for this article. It cleared up a lot of confusion I had.",
      },
    ],
    views: 150,
    likes: 45,
  },
  {
    id: 2,
    title: "Getting Started with React Hooks",
    paragraph:
      "React Hooks are functions that let you use state and other React features without writing a class. Hooks allow you to reuse stateful logic without changing your component hierarchy, making your components more readable and maintainable.",
    comments: [
      {
        user: "Charlie",
        comment:
          "Hooks have completely changed the way I write React components. This is a must-read for anyone new to Hooks.",
      },
      {
        user: "Dana",
        comment:
          "Fantastic introduction to Hooks. The examples were very helpful!",
      },
    ],
    views: 200,
    likes: 75,
  },
  {
    id: 3,
    title: "A Deep Dive into React State",
    paragraph:
      "State in React allows you to create dynamic and interactive components. This article explores the various ways to manage state in React, including useState and useReducer hooks.",
    comments: [
      {
        user: "Eve",
        comment:
          "This article really helped me understand state management in React.",
      },
      {
        user: "Frank",
        comment: "I appreciate the detailed explanations and examples.",
      },
    ],
    views: 180,
    likes: 60,
  },
  {
    id: 4,
    title: "Optimizing Performance in React Applications",
    paragraph:
      "Learn how to improve the performance of your React applications with techniques such as code splitting, lazy loading, and memoization.",
    comments: [
      {
        user: "Grace",
        comment: "These tips were very useful for optimizing my React app.",
      },
      {
        user: "Henry",
        comment: "Great insights into performance optimization!",
      },
    ],
    views: 220,
    likes: 90,
  },
  {
    id: 5,
    title: "Building Accessible React Apps",
    paragraph:
      "Accessibility is crucial for creating inclusive web applications. This article covers best practices for building accessible React apps.",
    comments: [
      {
        user: "Ivy",
        comment: "Accessibility is so important, thanks for this guide.",
      },
      {
        user: "Jack",
        comment: "Helpful tips for making my apps more accessible.",
      },
    ],
    views: 140,
    likes: 50,
  },
  {
    id: 6,
    title: "Styling React Components with CSS-in-JS",
    paragraph:
      "CSS-in-JS allows you to style React components using JavaScript. Explore libraries like styled-components and Emotion in this comprehensive guide.",
    comments: [
      {
        user: "Karen",
        comment:
          "CSS-in-JS has transformed the way I style my React components.",
      },
      {
        user: "Liam",
        comment:
          "Thanks for breaking down the pros and cons of different libraries.",
      },
    ],
    views: 160,
    likes: 70,
  },
  {
    id: 7,
    title: "Understanding React Context API",
    paragraph:
      "React Context API provides a way to pass data through the component tree without having to pass props down manually at every level. Learn how to use it effectively.",
    comments: [
      {
        user: "Mia",
        comment: "Context API is so powerful, thanks for this detailed guide.",
      },
      {
        user: "Noah",
        comment: "This helped me reduce prop drilling in my app.",
      },
    ],
    views: 130,
    likes: 55,
  },
  {
    id: 8,
    title: "React Router: A Complete Guide",
    paragraph:
      "React Router is a standard library for routing in React. This article covers everything you need to know to get started with React Router.",
    comments: [
      {
        user: "Olivia",
        comment:
          "Routing has always been confusing for me, this article cleared it up.",
      },
      {
        user: "Paul",
        comment: "Great examples and explanations!",
      },
    ],
    views: 210,
    likes: 85,
  },
  {
    id: 9,
    title: "State Management with Redux",
    paragraph:
      "Redux is a popular library for managing state in React applications. Learn the basics of Redux and how to integrate it with React.",
    comments: [
      {
        user: "Quinn",
        comment:
          "Redux seemed overwhelming at first, but this article made it approachable.",
      },
      {
        user: "Riley",
        comment: "Thank you for the step-by-step guide.",
      },
    ],
    views: 170,
    likes: 65,
  },
  {
    id: 10,
    title: "Creating Custom Hooks in React",
    paragraph:
      "Custom hooks allow you to extract and reuse stateful logic in your React applications. Learn how to create and use custom hooks effectively.",
    comments: [
      {
        user: "Sophia",
        comment:
          "Custom hooks have made my code so much cleaner. Thanks for this guide.",
      },
      {
        user: "Thomas",
        comment: "Excellent examples of custom hooks.",
      },
    ],
    views: 190,
    likes: 72,
  },
  {
    id: 11,
    title: "Testing React Components with Jest and Enzyme",
    paragraph:
      "Testing is crucial for maintaining a robust codebase. This article explains how to test React components using Jest and Enzyme.",
    comments: [
      {
        user: "Uma",
        comment:
          "Testing was always tricky for me, but this article clarified a lot.",
      },
      {
        user: "Victor",
        comment: "Great introduction to testing tools for React.",
      },
    ],
    views: 175,
    likes: 68,
  },
  {
    id: 12,
    title: "Managing Side Effects with React's useEffect Hook",
    paragraph:
      "The useEffect hook lets you perform side effects in function components. Learn how to manage side effects effectively in your React applications.",
    comments: [
      {
        user: "Wendy",
        comment:
          "useEffect was confusing at first, but this article helped a lot.",
      },
      {
        user: "Xander",
        comment: "Thanks for the practical examples of useEffect.",
      },
    ],
    views: 185,
    likes: 70,
  },
];

const truncateText = (text, maxWords) => {
  const words = text.split(" ");
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + " ......."
    : text;
};

blogData = blogData.map((blog) => ({
  ...blog,
  title: truncateText(blog.title, 6),
  paragraph: truncateText(blog.paragraph, 20),
}));

export default blogData;
