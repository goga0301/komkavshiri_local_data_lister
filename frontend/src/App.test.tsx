import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
 
describe('App Component Full Integration Test', () => {
  const mock = new MockAdapter(axios);
 
  beforeEach(() => {
    mock.reset();
  });
 
  it('renders start screen and proceeds to map view after start', async () => {
    mock.onGet('http://localhost:3001/api/local-items').reply(200, []);
 
    render(<App />);
 
    expect(screen.getByText("🌍 Let's explore Qutaia")).toBeInTheDocument();
    screen.getByText(/Start the Journey/i).click();
 
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument()
    );
  });
});