import { NextApiRequest, NextApiResponse } from 'next'

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Lucas' },
    { id: 2, name: 'Yngrid' },
    { id: 3, name: 'Lolla' },
  ];

  return response.json(users);
}