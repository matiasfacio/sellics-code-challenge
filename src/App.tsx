import React from "react";
import { PictureSelector } from "./components/PictureSelector";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <h2>Image Approval Application</h2>
      <PictureSelector />
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: grid;
  place-content: center;
  h2 {
    font-size: 1rem;
    color: #1b3d47;
  }
`;
