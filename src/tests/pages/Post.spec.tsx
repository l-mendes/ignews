import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>This is my new post</p>',
  updatedAt: '21 de julho de 2022'
};

jest.mock('../../services/prismic');

jest.mock('next-auth/react');

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('This is my new post')).toBeInTheDocument();
  });

  it('redirects user if no subscription was found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post',
        })
      })
    )
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrincimicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

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

    const response = await getServerSideProps({
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