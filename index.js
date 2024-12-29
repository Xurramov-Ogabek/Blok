const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // Serveringiz shu portda ishlashi kerak

// JSON fayllari yo'llari
const usersFilePath = './database/users.json';
const blogsFilePath = './database/blok.json';

// JSON bodyni ishlash
app.use(bodyParser.json());

// JSON o'qish va yozish uchun funksiyalar
const readFile = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// 1. Foydalanuvchi Ro'yxatdan O'tkazish
app.post('/users', (req, res) => {
  const { username, password, fullName, age, email, gender } = req.body;

  if (!username || username.length < 3) return res.status(400).json({ error: 'Username kamida 3 belgidan iborat bo‘lishi kerak.' });
  if (!password || password.length < 5) return res.status(400).json({ error: 'Password kamida 5 belgidan iborat bo‘lishi kerak.' });
  if (fullName && fullName.length < 10) return res.status(400).json({ error: 'FullName kamida 10 belgidan iborat bo‘lishi kerak.' });
  if (age && age < 10) return res.status(400).json({ error: 'Age kamida 10 yoshdan katta bo‘lishi kerak.' });
  if (!email) return res.status(400).json({ error: 'Email talab qilinadi.' });
  if (gender && !['male', 'female'].includes(gender)) return res.status(400).json({ error: 'Gender faqat "male" yoki "female" bo‘lishi mumkin.' });

  const users = readFile(usersFilePath);
  if (users.find((u) => u.username === username || u.email === email)) {
    return res.status(400).json({ error: 'Foydalanuvchi username yoki email allaqachon mavjud.' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
    fullName: fullName || '',
    age,
    email,
    gender: gender || '',
  };

  users.push(newUser);
  writeFile(usersFilePath, users);

  res.status(201).json({ message: 'Foydalanuvchi muvaffaqiyatli qo‘shildi.', user: newUser });
});

// 2. Foydalanuvchi Profili Bilan Ishlash
app.get('/users/:identifier', (req, res) => {
  const { identifier } = req.params;
  const users = readFile(usersFilePath);

  const user = users.find((u) => u.username === identifier || u.email === identifier);
  if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });

  res.json(user);
});

app.put('/users/:identifier', (req, res) => {
  const { identifier } = req.params;
  const { username, password, fullName, age, email, gender } = req.body;

  const users = readFile(usersFilePath);
  const userIndex = users.findIndex((u) => u.username === identifier || u.email === identifier);

  if (userIndex === -1) return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });

  const updatedUser = { ...users[userIndex], username, password, fullName, age, email, gender };
  users[userIndex] = updatedUser;

  writeFile(usersFilePath, users);
  res.json({ message: 'Foydalanuvchi muvaffaqiyatli yangilandi.', user: updatedUser });
});

app.delete('/users/:identifier', (req, res) => {
  const { identifier } = req.params;
  const users = readFile(usersFilePath);

  const updatedUsers = users.filter((u) => u.username !== identifier && u.email !== identifier);
  if (updatedUsers.length === users.length) return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });

  writeFile(usersFilePath, updatedUsers);
  res.json({ message: 'Foydalanuvchi muvaffaqiyatli o‘chirildi.' });
});

// 3. Blog Yozuvlari Bilan Ishlash
app.post('/blogs', (req, res) => {
  const { title, content, author, tags } = req.body;

  if (!title || !content || !author) return res.status(400).json({ error: 'Title, content va author talab qilinadi.' });

  const blogs = readFile(blogsFilePath);
  const newBlog = {
    id: blogs.length + 1,
    title,
    content,
    author,
    tags: tags || [],
  };

  blogs.push(newBlog);
  writeFile(blogsFilePath, blogs);

  res.status(201).json({ message: 'Blog muvaffaqiyatli qo‘shildi.', blog: newBlog });
});

app.get('/blogs', (req, res) => {
  const blogs = readFile(blogsFilePath);
  res.json(blogs);
});

app.put('/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, author, tags } = req.body;

  const blogs = readFile(blogsFilePath);
  const blogIndex = blogs.findIndex((b) => b.id === parseInt(id));

  if (blogIndex === -1) return res.status(404).json({ error: 'Blog topilmadi.' });

  const updatedBlog = { ...blogs[blogIndex], title, content, author, tags };
  blogs[blogIndex] = updatedBlog;

  writeFile(blogsFilePath, blogs);
  res.json({ message: 'Blog muvaffaqiyatli yangilandi.', blog: updatedBlog });
});

app.get('/users/:identifier', (req, res) => {
	// Kod foydalanuvchini 'identifier' orqali qidiradi
  });

app.delete('/blogs/:id', (req, res) => {
  const { id } = req.params;

  const blogs = readFile(blogsFilePath);
  const updatedBlogs = blogs.filter((b) => b.id !== parseInt(id));

  if (updatedBlogs.length === blogs.length) return res.status(404).json({ error: 'Blog topilmadi.' });

  writeFile(blogsFilePath, updatedBlogs);
  res.json({ message: 'Blog muvaffaqiyatli o‘chirildi.' });
});

app.get('/', (req, res) => {
	res.send('Welcome to the Blog Website!');
  });

// Serverni ishga tushirish
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
  });
  