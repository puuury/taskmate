# TaskMate

## 🇬🇧 English Description
TaskMate is a modern, user-friendly task management web application. It helps you organize, prioritize, and track your daily tasks with advanced features and a beautiful interface. This project is under active development and many more features will be added in the future.

### ✨ Features
- Add, edit, and delete tasks
- Mark tasks as done/undone
- Set deadlines and priorities for each task
- Task expiration system with visual alerts (overdue, due soon, due today)
- Filter tasks by status (all, done, not done)
- Filter tasks related to JavaScript
- Search tasks by title
- Sort tasks by date
- Responsive design for desktop and mobile
- Dark mode toggle with theme persistence
- Banned words filter for task titles
- Special modal for green words (e.g., "angry")
- Error messages for invalid input
- LocalStorage support for saving tasks and theme
- Disabled editing for expired tasks
- Visual cues for task urgency (animations, colors)

> **Note:** This project is a work in progress. Many more features and improvements will be added soon!

---

## 🚨 Troubleshooting (English)
If banned words or green words features do not work on GitHub Pages, make sure:
- The files `data/bannedWords.json` and `data/greenWords.json` exist in the `data/` folder at the project root.
- The fetch paths in `js/app.js` are set to `data/bannedWords.json` and `data/greenWords.json` (not '../data/...').
- You are running the project via a web server (not by opening the HTML file directly).
- Check the browser console (F12) for any fetch or CORS errors.

## 🇮🇷 توضیحات فارسی
تسک‌میت (TaskMate) یک اپلیکیشن مدرن و کاربرپسند برای مدیریت تسک‌ها است. با این برنامه می‌توانید کارهای روزانه خود را به راحتی سازماندهی، اولویت‌بندی و پیگیری کنید. این پروژه در حال توسعه است و امکانات بیشتری به آن افزوده خواهد شد.

### ✨ امکانات
- افزودن، ویرایش و حذف تسک‌ها
- علامت‌گذاری تسک‌ها به عنوان انجام‌شده یا انجام‌نشده
- تعیین تاریخ و اولویت برای هر تسک
- سیستم انقضای تسک با هشدارهای بصری (منقضی، نزدیک به موعد، امروز)
- فیلتر تسک‌ها بر اساس وضعیت (همه، انجام‌شده، انجام‌نشده)
- فیلتر تسک‌های مرتبط با جاوااسکریپت
- جستجوی تسک‌ها بر اساس عنوان
- مرتب‌سازی تسک‌ها بر اساس تاریخ
- طراحی واکنش‌گرا برای دسکتاپ و موبایل
- حالت تاریک با ذخیره‌سازی تم
- فیلتر کلمات ممنوع در عنوان تسک
- نمایش مودال ویژه برای کلمات سبز (مثلاً "عصبانی")
- پیام خطا برای ورودی نامعتبر
- ذخیره‌سازی تسک‌ها و تم در LocalStorage
- غیرفعال شدن ویرایش برای تسک‌های منقضی شده
- نشانه‌های بصری برای فوریت تسک (انیمیشن، رنگ)

> **توجه:** این پروژه هنوز کامل نشده و امکانات بیشتری به زودی به آن اضافه خواهد شد! 

---

## 🚨 راهنمای رفع مشکل (فارسی)
اگر امکانات کلمات ممنوع یا سبز در گیت‌هاب پیج کار نمی‌کند:
- مطمئن شوید فایل‌های `data/bannedWords.json` و `data/greenWords.json` در پوشه `data/` در ریشه پروژه وجود دارند.
- مسیر fetch در فایل `js/app.js` باید `data/bannedWords.json` و `data/greenWords.json` باشد (نه '../data/...').
- پروژه را با یک سرور محلی یا روی هاست اجرا کنید، نه فقط باز کردن فایل HTML.
- کنسول مرورگر (F12) را برای خطاهای fetch یا CORS بررسی کنید. 