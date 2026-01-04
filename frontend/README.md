# Frontend - e-med

Эмчийн сургалтын сайтын React frontend

## Технологиуд

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - API client
- **Tailwind CSS** - Styling
- **react-i18next** - Internationalization (Монгол/Англи хэл)

## Бүтэц

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── course/        # Course components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Zustand stores
│   ├── i18n/              # Internationalization
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static files
└── package.json
```

## Хэрэгжүүлсэн Функц

### Pages
- ✅ Home - Нүүр хуудас
- ✅ Courses - Хичээлүүдийн жагсаалт
- ✅ Login - Нэвтрэх
- ✅ Register - Бүртгүүлэх
- ⏳ Course Detail - Хичээлийн дэлгэрэнгүй
- ⏳ Lesson Player - Видео тоглуулагч
- ⏳ My Courses - Миний хичээлүүд
- ⏳ Profile - Профайл

### Components
- ✅ Header - Цэс
- ✅ Footer - Хөл
- ✅ LoginForm - Нэвтрэх форм
- ✅ RegisterForm - Бүртгүүлэх форм
- ✅ CourseCard - Хичээлийн карт
- ✅ Button, Input, Loading - Common components

### Services
- ✅ API client (axios)
- ✅ Auth service
- ✅ Course service
- ✅ Lesson service

### State Management
- ✅ Auth store (Zustand)
- ✅ Course store (Zustand)

### Features
- ✅ Authentication flow
- ✅ Token refresh
- ✅ Protected routes
- ✅ i18n (Монгол/Англи)
- ✅ Responsive design (Tailwind CSS)
- ✅ Error handling

## Ажиллуулах

```bash
# Dependencies суулгах
npm install

# Development server эхлүүлэх
npm run dev

# Build хийх
npm run build

# Preview production build
npm run preview
```

## Environment Variables

`.env` файл үүсгэх:

```env
VITE_API_URL=http://localhost:5000/api
```

## Дараагийн Алхам

- [ ] Course Detail page
- [ ] Lesson Player
- [ ] Quiz component
- [ ] Payment integration
- [ ] Certificate display
- [ ] Profile page
- [ ] Admin dashboard

