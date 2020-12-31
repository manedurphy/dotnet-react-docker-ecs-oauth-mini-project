import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleGitHubAuthorization } from '../../Requests/axios';
import { setUser, setUserLoading } from '../../redux/slices/userSlice';
import { setOAuthLoading } from '../../redux/slices/OAuthSlice';
import styled from 'styled-components';
import { setAlert } from '../../redux/slices/alertSlice';
import { Redirect } from 'react-router-dom';
import { Box } from './oauth-styles';
import {
  AuthorizeSuccessResponse,
  GlobalState,
} from '../../Requests/interfaces';

// const GitHubUrl =
//   'https://github.com/login/oauth/authorize?client_id=fcde8c7e6a393f4ef25e&scope=user&redirect_uri=http://localhost:3000/oauth';
const GitHubUrl =
  'https://github.com/login/oauth/authorize?client_id=dc66fcdec00e52ce44b8&scope=user&redirect_uri=http://ecs-lb-frontend-1727102227.us-east-1.elb.amazonaws.com/oauth';

const GitHub: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: GlobalState) => state.OAuth);

  useEffect((): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      dispatch(setUserLoading(true));
      dispatch(setOAuthLoading(true));
      (async () => {
        try {
          const successResponse: AuthorizeSuccessResponse = await handleGitHubAuthorization(
            code
          );
          dispatch(
            setUser({
              name: successResponse.name,
              email: successResponse.email,
              isAuthorized: true,
              loading: false,
            })
          );
        } catch (err) {
          dispatch(setUserLoading(false));
          dispatch(setOAuthLoading(false));
          dispatch(
            setAlert({
              message: err.response.data.message,
              statusCode: err.response.status,
            })
          );
        }
      })();
    }
  }, []);

  return (
    <Box>
      <h2>Login With GitHub</h2>
      <Container>
        <InnerContainer>
          <span>
            <i className="fab fa-github"></i>
          </span>
          <Link href={GitHubUrl}>Click here</Link>
        </InnerContainer>
      </Container>
      {loading && <Redirect to="/oauth" />}
    </Box>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const InnerContainer = styled.div`
  border: 1px solid black;
  height: 36px;
  width: 120px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: -0px 1px 4px 0px grey;
`;

const Link = styled.a`
  color: black;
  text-decoration: none;
  font-size: 1rem;
`;

export default GitHub;
