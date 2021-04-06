import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Form, FormGroup, Input, Table } from "reactstrap";
import { findRepositories } from "./services/api";
import LoadingGIF from "./assets/loading.gif";

interface Repository {
  id: string;
  owner: {
    avatar_url: string;
  };
  html_url: string;
  stargazers_count: string;
}

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollRadio, setScrollRadio] = useState<boolean>(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const scrollObserve = useRef<HTMLDivElement | null>(null);

  const findRepositoriesLocal = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      findRepositories(search, 0).then(({ data }) => {
        setRepositories([...data.items]);
        setLoading(false);
      });
    },
    [repositories, page, search]
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollRadio(entry.isIntersecting);
        console.log(entry);
      },
      { rootMargin: "10px" }
    );
    if (scrollObserve.current) {
      intersectionObserver.observe(scrollObserve.current);
    }
    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRadio && search.trim() !== "") {
      const newPage = page + 1;
      setPage(newPage);
      setLoading(true);
      console.log("Página: ", newPage);
      findRepositories(search, newPage).then(({ data }) => {
        setRepositories([...repositories, ...data.items]);
        setLoading(false);
      });
    }
  }, [scrollRadio]);

  return (
    <div className="App p-4">
      <h1>What are looking for?</h1>
      <Form onSubmit={findRepositoriesLocal}>
        <FormGroup>
          <Input onChange={(e) => setSearch(e.target.value)} type={"text"} />
        </FormGroup>
        <Button type="submit">Search</Button>
      </Form>
      <br />
      <br />

      {repositories.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Avatar</th>
              <th>Url</th>
              <th>Stars</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map((repo) => {
              return (
                <tr key={repo.id}>
                  <td>{repo.id}</td>
                  <td>
                    <img
                      src={repo.owner.avatar_url}
                      width="50"
                      alt={repo.owner.avatar_url}
                    />
                  </td>
                  <td>
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.html_url}
                    </a>
                  </td>
                  <td>{repo.stargazers_count}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <div ref={scrollObserve}></div>
      {loading && (
        <div>
          <img src={LoadingGIF} alt="Loading" width="50" />
          Loading
        </div>
      )}
    </div>
  );
}

export default App;
