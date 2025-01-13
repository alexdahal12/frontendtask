import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Kanban Board', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the kanban board title', () => {
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('allows searching for tasks', async () => {
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await userEvent.type(searchInput, 'test task');
    expect(searchInput).toHaveValue('test task');
  });

  it('renders undo and redo buttons', () => {
    expect(screen.getByLabelText('Undo')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo')).toBeInTheDocument();
  });

  it('renders the add column button', () => {
    expect(screen.getByText('Add Column')).toBeInTheDocument();
  });
});