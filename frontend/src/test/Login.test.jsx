import { render, screen, within } from '@testing-library/react';
import userEvent from 'user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  // Rendering Tests
  describe('Initial Render', () => {
    it('should render the Login component without crashing', () => {
      renderWithRouter(<Login />);
      expect(screen.getByRole('heading', { level: 5, name: 'Login' })).toBeInTheDocument();
    });

    it('should render the card container with correct styling', () => {
      const { container } = renderWithRouter(<Login />);
      const card = container.querySelector('[class*="MuiCard"]');
      expect(card).toBeInTheDocument();
    });

    it('should display Login tab as active by default', () => {
      renderWithRouter(<Login />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('should render two tabs: Login and Sign Up', () => {
      renderWithRouter(<Login />);
      expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Sign Up' })).toBeInTheDocument();
    });
  });

  // Tab Switching Tests
  describe('Tab Switching', () => {
    it('should switch to Sign Up tab when clicked', async () => {
      renderWithRouter(<Login />);

      const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
      await userEvent.click(signupTab);

      expect(signupTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Login' })).toHaveAttribute('aria-selected', 'false');
    });

    it('should change title to Sign Up when Sign Up tab is clicked', async () => {
      renderWithRouter(<Login />);

      const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
      await userEvent.click(signupTab);

      expect(screen.getByRole('heading', { level: 5, name: 'Sign Up' })).toBeInTheDocument();
    });

    it('should switch back to Login tab from Sign Up tab', async () => {
      renderWithRouter(<Login />);

      const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
      const loginTab = screen.getByRole('tab', { name: 'Login' });

      await userEvent.click(signupTab);
      expect(screen.getByRole('heading', { level: 5, name: 'Sign Up' })).toBeInTheDocument();

      await userEvent.click(loginTab);
      expect(screen.getByRole('heading', { level: 5, name: 'Login' })).toBeInTheDocument();
    });

    it('should change button text based on tab', async () => {
      renderWithRouter(<Login />);

      expect(screen.getByRole('button', { name: /^Login$/ })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('tab', { name: 'Sign Up' }));
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should change footer text based on tab', async () => {
      renderWithRouter(<Login />);

      expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();

      await userEvent.click(screen.getByRole('tab', { name: 'Sign Up' }));
      expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
    });

    it('should toggle tabs using footer text links', async () => {
      renderWithRouter(<Login />);

      const signupLink = screen.getByText("Don't have an account? Sign up");
      await userEvent.click(signupLink);

      expect(screen.getByRole('tab', { name: 'Sign Up' })).toHaveAttribute('aria-selected', 'true');

      const loginLink = screen.getByText('Already have an account? Login');
      await userEvent.click(loginLink);

      expect(screen.getByRole('tab', { name: 'Login' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  // Form Input Tests
  describe('Form Inputs', () => {
    it('should render username and password fields', () => {
      renderWithRouter(<Login />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should update username field when user types', async () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      await userEvent.type(usernameInput, 'testuser');

      expect(usernameInput).toHaveValue('testuser');
    });

    it('should update password field when user types', async () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText('Password');
      await userEvent.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('should update both fields independently', async () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      await userEvent.type(usernameInput, 'john');
      await userEvent.type(passwordInput, 'secure');

      expect(usernameInput).toHaveValue('john');
      expect(passwordInput).toHaveValue('secure');
    });

    it('should have password field input type as password', () => {
      renderWithRouter(<Login />);
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should allow multiple type operations on same field', async () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');

      await userEvent.type(usernameInput, 'firstvalue');
      expect(usernameInput).toHaveValue('firstvalue');

      // Clear the field manually to test typing again
      usernameInput.value = '';
      
      await userEvent.type(usernameInput, 'secondvalue');
      expect(usernameInput).toHaveValue('secondvalue');
    });
  });

  // Validation Tests
  describe('Form Validation', () => {
    it('should show alert when username is less than 4 characters', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'joe');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Username must be at least 4 characters');

      vi.unstubAllGlobals();
    });

    it('should show alert when password is less than 6 characters', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, '12345');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Password must be at least 6 characters');

      vi.unstubAllGlobals();
    });

    it('should trigger username validation before password validation', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'ab');
      await userEvent.type(passwordInput, '123');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Username must be at least 4 characters');
      expect(window.alert).not.toHaveBeenCalledWith('Password must be at least 6 characters');

      vi.unstubAllGlobals();
    });

    it('should allow submission with valid credentials on Login tab', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'validuser');
      await userEvent.type(passwordInput, 'validpass123');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Login successful');

      vi.unstubAllGlobals();
    });

    it('should allow submission with valid credentials on Sign Up tab', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
      await userEvent.click(signupTab);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });

      await userEvent.type(usernameInput, 'newuser');
      await userEvent.type(passwordInput, 'securepass123');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Account created! Please complete your profile.');

      vi.unstubAllGlobals();
    });

    it('should not submit with empty fields', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /^Login$/ });
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Username must be at least 4 characters');

      vi.unstubAllGlobals();
    });

    it('should accept username with exactly 4 characters', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'user');
      await userEvent.type(passwordInput, 'password');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Login successful');

      vi.unstubAllGlobals();
    });

    it('should accept password with exactly 6 characters', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'username');
      await userEvent.type(passwordInput, '123456');
      await userEvent.click(submitButton);

      expect(window.alert).toHaveBeenCalledWith('Login successful');

      vi.unstubAllGlobals();
    });
  });

  // Requirements Display Test
  describe('Requirements Display', () => {
    it('should display requirements text', () => {
      renderWithRouter(<Login />);
      expect(screen.getByText(/Requirements:/)).toBeInTheDocument();
      expect(screen.getByText(/Username: at least 4 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Password: at least 6 characters/)).toBeInTheDocument();
    });
  });

  // Button Tests
  describe('Submit Button', () => {
    it('should render submit button', () => {
      renderWithRouter(<Login />);
      expect(screen.getByRole('button', { name: /^Login$/ })).toBeInTheDocument();
    });

    it('should have fullWidth button styling', () => {
      const { container } = renderWithRouter(<Login />);
      const button = screen.getByRole('button', { name: /^Login$/ });
      expect(button.closest('button')).toHaveStyle({ width: '100%' });
    });

    it('should be clickable', async () => {
      vi.stubGlobal('alert', vi.fn());

      renderWithRouter(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const button = screen.getByRole('button', { name: /^Login$/ });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'testpass123');
      await userEvent.click(button);

      expect(window.alert).toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });
});
