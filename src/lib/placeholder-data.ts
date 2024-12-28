import { EntryType } from '@prisma/client';

const users = [
  {
    name: 'John Doe',
    email: 'user1@example.com',
    password: '12345654321',
  },
  {
    name: 'Jane Doe',
    email: 'user2@example.com',
    password: '65432123456',
  },
];

const entries = [
  {
    type: EntryType.TODO,
    title: 'Buy milk',
    userEmail: 'user1@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy eggs',
    userEmail: 'user1@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy bread',
    userEmail: 'user2@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'eat eggs',
    userEmail: 'user1@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'eat bread',
    userEmail: 'user2@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy butter',
    userEmail: 'user2@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy cheese',
    userEmail: 'user1@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy apples',
    userEmail: 'user1@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy oranges',
    userEmail: 'user2@example.com',
  },
  {
    type: EntryType.TODO,
    title: 'Buy bananas',
    userEmail: 'user2@example.com',
  }
];

export { users, entries };