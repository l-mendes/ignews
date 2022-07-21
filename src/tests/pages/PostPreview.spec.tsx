import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>This is my new post</p>',
  updatedAt: '21 de julho de 2022'
};

jest.mock('../../services/prismic');
jest.mock('next-auth/react');
jest.mock('next/router');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

    render(<Post post={post}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('This is my new post')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn()

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
      push: pushMock,
    } as any);

    render(<Post post={post}/>);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrincimicClientMocked = mocked(getPrismicClient);

    getPrincimicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post' },
          ],
          content: [
            { type: 'paragraph', text: 'This is my new post' },
          ]
        },
        last_publication_date: '07-21-2022',
      })
    } as any);

    const response = await getStaticProps({
      params: { slug: 'my-new-post' }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: post
        }
      })
    )
  });
});