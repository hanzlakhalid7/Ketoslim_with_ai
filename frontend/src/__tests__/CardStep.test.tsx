
import { render, screen } from '@testing-library/react';
import CardStep from '../components/CardStep';

describe('CardStep', () => {
  it('renders title and optional content', () => {
    render(<CardStep title="Hello World" subtitle="sub" description="desc" />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('sub')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(<CardStep title="With image" image="/logo.png" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.png');
  });
});
