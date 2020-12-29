import React from 'react';
import styled from 'styled-components';
import './index.css';

interface AppProps {
  greeting: string;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  return (
    <div>
      <Header>{props.greeting}</Header>
    </div>
  );
};

const Header = styled.h1`
  color: green;
`;

export default App;
