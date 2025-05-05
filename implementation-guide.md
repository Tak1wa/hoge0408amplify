# Todo App Deadline Field Implementation Guide

## Overview
This guide explains how to update the Todo app frontend to include the new "deadline" field that has already been added to the backend schema.

## Backend Changes (Completed)
✅ The Todo model schema has been updated in `amplify/data/resource.ts` to include a `deadline` field:

```typescript
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      deadline: a.string(), // Added deadline field
    })
    .authorization((allow) => [allow.guest()]),
});
```

## Frontend Implementation Guide

Follow these steps to update your frontend code:

### 1. Update the Todo Form Component

In your frontend Todo form component, add an input field for the deadline:

```tsx
// Import a date picker component if needed
import DatePicker from 'your-preferred-date-picker';
import { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

function TodoForm() {
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState(''); // Add state for deadline
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format the date as yyyy/MM/dd (assuming deadline is a Date object)
    let formattedDeadline = '';
    if (deadline) {
      const date = new Date(deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDeadline = `${year}/${month}/${day}`;
    }
    
    // Create a new Todo with both content and deadline
    await client.models.Todo.create({
      content,
      deadline: formattedDeadline,
    });
    
    // Clear form after submission
    setContent('');
    setDeadline('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        placeholder="Enter task content" 
        required 
      />
      
      {/* Add a date input for the deadline */}
      <input 
        type="date" 
        value={deadline} 
        onChange={e => setDeadline(e.target.value)} 
        placeholder="Select deadline (yyyy/MM/dd)" 
      />
      
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### 2. Update the Todo List Component

Update your Todo list component to display the deadline:

```tsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    // Fetch todos when component mounts
    const fetchTodos = async () => {
      const { data } = await client.models.Todo.list();
      setTodos(data);
    };
    
    fetchTodos();
  }, []);
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <div>{todo.content}</div>
          {/* Display the deadline if it exists */}
          {todo.deadline && (
            <div>Deadline: {todo.deadline}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
```

### 3. Testing

After implementing these changes:

1. Make sure the deadline is saved in the format `yyyy/MM/dd`
2. Verify that the deadline is displayed correctly in the Todo list
3. Test that both new and existing todos work as expected

## Notes

- You may need to adjust the styling to match your app's design
- Consider adding validation to ensure the deadline format is correct
- If your app uses a different state management approach or component structure, adapt these examples accordingly