import axios from 'axios';

const api = axios.create({
  headers: {
    Authorization: process.env.GITHUB_TOKEN,
  }
});

export const findRepositories = async (search: string, page: number) => {
  const result = await api.get(
    `https://api.github.com/search/repositories?q=${search}&per_page=10&page=${page}`
  );
  return result;
};