import React, {
  Children,
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
  useContext,
  useState,
} from "react";
import "./App.css";

const RouterContext = createContext<{
  path: string;
  handleChangePath(value: string): void;
}>({
  path: "/",
  handleChangePath: () => undefined,
});

RouterContext.displayName = "RouterContext";

const Router: FC<{ children?: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState("/");

  const handleChangePath = (path: string) => {
    window.history.pushState({}, "", path);
    setPath(path);
  };

  return (
    <RouterContext.Provider value={{ path, handleChangePath }}>
      {children}
    </RouterContext.Provider>
  );
};

const Routes: FC<{ children: ReactNode }> = ({ children }) => {
  const { path } = useContext(RouterContext);

  let selectedRoute = null;

  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === React.Fragment) {
      return;
    }
    if (typeof child === "string") {
      return;
    }
    if (typeof child === "undefined") {
      return;
    }
    if (typeof child === "number") {
      return;
    }
    if (typeof child === "boolean") {
      return;
    }
    if (!child) {
      return;
    }

    if (!child.props.path || !child.props.element) {
      return;
    }
    if (child.props.path === path) {
      selectedRoute = child.props.element;
    }
  });
  console.log(selectedRoute, path, children);
  return selectedRoute;
};

const Route: FC<{ path: string; element: ReactNode }> = () => {
  return null;
};

const Link: FC<{ to: string; children: ReactNode }> = ({ to, children }) => {
  const { handleChangePath: onChangePath } = useContext(RouterContext);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    console.log(to);
    // window.location.pathname = to;
    // 재요청 방지
    // window.history.pushState({}, "", to);
    // TODO: 리액트에게 리랜더 요청하기
    onChangePath(to);
  };
  return (
    <a href="/" onClick={handleClick}>
      {children}
    </a>
  );
};

const UserPage: FC = () => {
  return (
    <>
      <h1>User Page</h1>
      <Link to="/">{`<< Home Page`}</Link>
    </>
  );
};

const HomePage: FC = () => {
  return (
    <>
      <h1>Home Page</h1>
      <Link to="/user">{`User Page >>`}</Link>
    </>
  );
};

// 이게 도달할 정상이고
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/a" element={<A />}></Route>
//         <Route path="/b" element={<B />}></Route>
//       </Routes>
//     </Router>
//   );
// }

function App() {
  // if (pathname === "/user") {
  //   return <UserPage />;
  // }

  // return <HomePage />;

  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
