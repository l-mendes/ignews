import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');

jest.mock('next/router');

describe('SubscribeButton component', () => {
  it('should renders SubscribeButton correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('should redirect user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    const sigInMocked = mocked(signIn);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(sigInMocked).toHaveBeenCalled();
  });

  it('should redirect to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          image: 'https://github.com/l-mendes.png',
        },
        activeSubscription: 'fake-active-subscription',
        expires: new Date(new Date().getTime() + (1000 * 60 * 60)).toDateString(),
      },
      status: 'authenticated',
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
});