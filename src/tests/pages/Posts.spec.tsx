import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
  { slug: 'my-new-post', title: 'My New Post', excerpt: 'This is my new post', updatedAt: '21 de julho de 2022' },
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts}/>);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My New Post' },
              ],
              content: [
                { type: 'paragraph', text: 'This is my new post' },
              ]
            },
            last_publication_date: '07-21-2022',
          }
        ],
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: posts
        }
      })
    )
  });
});