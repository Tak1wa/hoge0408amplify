# Todo App Implementation Guide

This guide explains how to implement the Todo application UI with the newly added "deadline" field.

## Backend Schema

The backend schema has been updated to include a new `deadline` field in the Todo model:

```typescript
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      deadline: a.string(), // Format: yyyy/MM/dd
    })
    .authorization((allow) => [allow.guest()]),
});
```

## Frontend Implementation

### Setting up the Frontend Project

1. First, you need to set up a frontend project. We recommend using React with AWS Amplify.

```bash
npx create-react-app todo-app
cd todo-app
npm install aws-amplify
```

2. Configure Amplify in your app:

```javascript
// src/index.js
import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);
```

### Creating Todo Form Component

Create a form component that allows users to input both the content and deadline:

```jsx
// src/components/TodoForm.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function TodoForm() {
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format the date to yyyy/MM/dd
    let formattedDeadline = deadline;
    if (deadline) {
      const date = new Date(deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDeadline = `${year}/${month}/${day}`;
    }
    
    try {
      await client.models.Todo.create({
        content,
        deadline: formattedDeadline,
      });
      
      // Clear form
      setContent('');
      setDeadline('');
      
      // Refresh todo list (you might have a state update or callback here)
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Content:</label>
        <input 
          id="content"
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
      </div>
      
      <div>
        <label htmlFor="deadline">Deadline:</label>
        <input 
          id="deadline"
          type="date" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)} 
        />
        <small>Format will be stored as: yyyy/MM/dd</small>
      </div>
      
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
```

### Creating Todo List Component

Create a component to display todos with their deadlines:

```jsx
// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  async function fetchTodos() {
    try {
      const todoData = await client.models.Todo.list();
      setTodos(todoData.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }
  
  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <div>{todo.content}</div>
            {todo.deadline && (
              <div className="deadline">
                Deadline: {todo.deadline}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

### Using Components in App

Integrate the components into your main App component:

```jsx
// src/App.js
import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Todo Application</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
```

### Styling (Optional)

Add some basic styles to make the UI more appealing:

```css
/* src/App.css */
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.deadline {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}
```

## Conclusion

This implementation provides a simple Todo app that allows users to:

1. Create new todos with both content and deadline fields
2. View a list of todos showing both content and deadlines
3. Store deadlines in the required yyyy/MM/dd format

The implementation uses:
- HTML date input for easy date selection
- JavaScript date formatting to ensure the correct format
- AWS Amplify client libraries to interact with the backend

You can expand this implementation with features like:
- Todo editing
- Todo deletion
- Todo completion status
- Filtering or sorting by deadline
- Deadline notifications or color-coding based on urgency