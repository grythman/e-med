import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import useCourseStore from '../../store/courseStore';

// Mock the store
vi.mock('../../store/courseStore', () => ({
  default: () => ({
    courses: [
      {
        _id: '1',
        title: 'Test Course 1',
        description: 'Test Description',
        price: 50000,
      },
      {
        _id: '2',
        title: 'Test Course 2',
        description: 'Test Description 2',
        price: 0,
      },
    ],
    isLoading: false,
    fetchCourses: vi.fn(),
  }),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Home', () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renders hero section', () => {
    renderHome();
    expect(screen.getByText(/Эмчийн мэргэжлийн/i)).toBeInTheDocument();
  });

  it('renders stats section', () => {
    renderHome();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('10,000+')).toBeInTheDocument();
  });

  it('renders features section', () => {
    renderHome();
    expect(screen.getByText(/Давуу талууд/i)).toBeInTheDocument();
    expect(screen.getByText(/Мэргэжлийн сургалт/i)).toBeInTheDocument();
  });

  it('renders featured courses section', () => {
    renderHome();
    expect(screen.getByText(/Онцлох хичээлүүд/i)).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderHome();
    expect(screen.getByText(/Өнөөдөр сурч эхлээрэй/i)).toBeInTheDocument();
  });

  it('has links to courses and register', () => {
    renderHome();
    const coursesLink = screen.getByText(/Хичээлүүд үзэх/i).closest('a');
    expect(coursesLink).toHaveAttribute('href', '/courses');
  });
});

