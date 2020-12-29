import React from 'react';

interface AppProps {
  greeting: string;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  return (
    <div>
      <h1>{props.greeting}</h1>
    </div>
  );
};

export default App;
