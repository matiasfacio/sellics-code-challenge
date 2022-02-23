import React from "react";
import { PicturesSliceAction } from "../features/pictures/picturesSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { usePictureFetch } from "../utils/usePictureFetch";
import styled, { css } from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

export const PictureSelector = () => {
  const [nextPicture, fetchNextPicture, errorFetching, resetError] =
    usePictureFetch();
  const [error, setError] = React.useState(null);
  const selectedPictures = useAppSelector(
    (state) => state.pictures.selectedPictures
  );
  const rejectedPictures = useAppSelector(
    (state) => state.pictures.rejectedPictures
  );

  React.useEffect(() => {
    if (rejectedPictures.includes(nextPicture)) {
      fetchNextPicture();
    }
  }, [nextPicture, fetchNextPicture, rejectedPictures]);

  const dispatch = useAppDispatch();
  const addNewSelectedPictureToStore = (selectedPic) =>
    dispatch(PicturesSliceAction.addSelectedPicture(selectedPic));
  const addRejectedPicture = (rejectedPic) =>
    dispatch(PicturesSliceAction.addRejectedPicture(rejectedPic));

  const handleClick = (pic) => {
    if (selectedPictures.includes(pic)) {
      setError("You have already stored this picture.");
      setTimeout(() => {
        setError(null);
        fetchNextPicture();
      }, 3000);
    } else {
      addNewSelectedPictureToStore(pic);
      fetchNextPicture();
    }
  };

  const handleRejectAndNext = (rejectedPic) => {
    addRejectedPicture(rejectedPic);
    fetchNextPicture();
  };

  return (
    <PictureSelectorContainer>
      {error && <Error>{error}</Error>}
      {errorFetching && <Error>{errorFetching}</Error>}
      <CarrousselContainer>
        <h2>Approved Images ({selectedPictures.length})</h2>
        <CarrusselComp
          pictures={selectedPictures}
          onClick={() => fetchNextPicture()}
        />
      </CarrousselContainer>
      <Divisor />
      {nextPicture ? (
        <StyledPictureContainer>
          <Picture
            url={nextPicture.urls.regular}
            onClick={() => {
              handleClick(nextPicture.id);
            }}
          />
        </StyledPictureContainer>
      ) : (
        <EmptyPicture onClick={() => fetchNextPicture()}>
          <AddIcon fontSize="large" />
        </EmptyPicture>
      )}
      {!nextPicture ? (
        <ClickMoreText>
          Click on '+' in order to get image recommendations
        </ClickMoreText>
      ) : (
        <ButtonsGroup
          pic={nextPicture}
          onOk={() => handleClick(nextPicture.urls.regular)}
          onCancel={() => handleRejectAndNext(nextPicture.urls.regular)}
        />
      )}
    </PictureSelectorContainer>
  );
};

const ButtonsGroup = ({ onOk, onCancel, pic }) => {
  return (
    <ButtonGroup>
      <Button disabled={!pic} color="red" onClick={onCancel}>
        <ClearIcon />
      </Button>
      <Button disabled={!pic} color="green" onClick={onOk}>
        <CheckIcon />
      </Button>
    </ButtonGroup>
  );
};

const CarrusselComp = ({ pictures, onClick }) => {
  return (
    <>
      <Carroussel>
        {!pictures.length ? (
          <EmptyCarrouselPic onClick={onClick}>
            <AddIcon />
          </EmptyCarrouselPic>
        ) : (
          <>
            {pictures.map((pic) => {
              return <CarrousselImage key={pic} url={pic} />;
            })}
          </>
        )}
      </Carroussel>
    </>
  );
};

const PictureSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 50px;
  width: 300px;
`;

const StyledPictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  gap: 50px;
`;

const ClickMoreText = styled.p`
  text-align: center;
  color: #292929;
`;

const Button = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 50px;
  border-radius: 9999px;
  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `}
  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const Picture = styled.div`
  height: 300px;
  width: 300px;
  ${({ url }) => css`
    background-image: url(${url});
    background-size: cover;
    background-repeat: no-repeat;
  `}
`;

const EmptyPicture = styled.div`
  height: 300px;
  width: 300px;
  background-color: lightblue;
  display: grid;
  place-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
`;

const Divisor = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const CarrousselContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Carroussel = styled.div`
  display: flex;
  width: 300px;
  overflow-x: auto;
  gap: 10px;
  justify-content: flex-start;
`;

const CarrousselImage = styled.div`
  height: 60px;
  flex-basis: 25%;
  overflow: hidden;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: lightblue;
  ${({ url }) => css`
    background-image: url(${url});
    background-size: cover;
  `}
`;

const EmptyCarrouselPic = styled.div`
  height: 60px;
  flex-basis: 20%;
  background-color: lightblue;
  display: grid;
  place-content: center;
  color: white;
  font-size: 3rem;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 50px;
`;

const Error = styled.pre`
  color: red;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;