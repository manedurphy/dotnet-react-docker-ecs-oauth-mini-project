import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

export const Form = styled.form`
  width: 20%;
`;

export const FormGroup = styled.div`
  margin: 1rem 0;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 20px;
`;

export const Alert = styled.div`
  width: 100%;
  height: 30px;
  background-color: #ff5b1e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const Link = styled.a`
  text-decoration: none;
  color: blue;
  font-size: 1rem;
  cursor: pointer;
`;
