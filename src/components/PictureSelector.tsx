import React, { VFC } from "react";
import {
  PicturesSliceAction,
  Picture as PictureType,
  SelectedPicture,
  RejectedPicture,
  SelectedPictures,
} from "../features/pictures/picturesSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { usePictureFetch } from "../utils/usePictureFetch";
import styled, { css } from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

export const PictureSelector = () => {
  const { nextPicture, fetchNextPicture, errorFetching } = usePictureFetch();
  const [error, setError] = React.useState<string | null>(null);
  const selectedPictures = useAppSelector((state) => state.selectedPictures);
  const rejectedPictures = useAppSelector((state) => state.rejectedPictures);

  React.useEffect(() => {
    if (nextPicture !== null) {
      if (rejectedPictures.includes(nextPicture)) {
        fetchNextPicture();
      }
    }
  }, [nextPicture, fetchNextPicture, rejectedPictures]);

  const dispatch = useAppDispatch();
  const addNewSelectedPictureToStore = (selectedPic: SelectedPicture) =>
    dispatch(PicturesSliceAction.addSelectedPicture(selectedPic));
  const addRejectedPicture = (rejectedPic: RejectedPicture) =>
    dispatch(PicturesSliceAction.addRejectedPicture(rejectedPic));
  const removeSelectedPicture = (selectedPic: SelectedPicture) =>
    dispatch(PicturesSliceAction.removeSelectedPicture(selectedPic));

  const handleClick = (pic: PictureType) => {
    if (selectedPictures?.includes(pic)) {
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

  const handleRejectAndNext = (rejectedPic: RejectedPicture) => {
    addRejectedPicture(rejectedPic);
    fetchNextPicture();
  };

  const handleUnselect = (pic: SelectedPicture) => {
    removeSelectedPicture(pic);
  };

  return (
    <PictureSelectorContainer>
      {error && <Error>{error}</Error>}
      {errorFetching && <Error>{errorFetching}</Error>}
      <CarrousselComp
        pictures={selectedPictures}
        onClick={() => fetchNextPicture()}
        unCheck={(pic: SelectedPicture) => handleUnselect(pic)}
      />
      <Divisor />
      {nextPicture ? (
        <StyledPictureContainer
          onClick={() => {
            handleClick(nextPicture);
          }}
        >
          <img src={nextPicture} alt="next" />
        </StyledPictureContainer>
      ) : (
        <EmptyPicture onClick={() => fetchNextPicture()} data-testid="load">
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
          onOk={() => handleClick(nextPicture)}
          onCancel={() => handleRejectAndNext(nextPicture)}
        />
      )}
    </PictureSelectorContainer>
  );
};

interface ButtonsGroupProps {
  onOk: () => void;
  onCancel: () => void;
  pic: PictureType;
}

const ButtonsGroup: VFC<ButtonsGroupProps> = ({ onOk, onCancel, pic }) => {
  return (
    <ButtonGroup>
      <Button
        disabled={!pic}
        color="red"
        onClick={onCancel}
        data-testid="reject"
      >
        <ClearIcon />
      </Button>
      <Button
        disabled={!pic}
        color="green"
        onClick={onOk}
        data-testid={"select"}
      >
        <CheckIcon />
      </Button>
    </ButtonGroup>
  );
};

interface CarrousselCompProps {
  pictures: SelectedPictures;
  onClick: () => void;
  unCheck: (value: SelectedPicture) => void;
}

const CarrousselComp: VFC<CarrousselCompProps> = ({
  pictures,
  onClick,
  unCheck,
}) => {
  return (
    <CarrousselContainer>
      <h2 data-testid="pictures-length">
        Approved Images ({pictures?.length})
      </h2>
      <Carroussel>
        {!pictures.length ? (
          <EmptyCarrouselPic onClick={onClick}>
            <AddIcon />
          </EmptyCarrouselPic>
        ) : (
          <>
            {pictures.map((pic: SelectedPicture) => {
              return (
                <CarrousselImage key={pic} url={pic}>
                  <CheckIcon className="icon" onClick={() => unCheck(pic)} />
                </CarrousselImage>
              );
            })}
          </>
        )}
      </Carroussel>
    </CarrousselContainer>
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
  gap: 50px;
  width: 300px;
  object-fit: contain;
`;

const ClickMoreText = styled.p`
  text-align: center;
  color: #292929;
`;

const Button = styled.button<{ color: string }>`
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

const CarrousselImage = styled.div<{ url: SelectedPicture }>`
  height: 60px;
  flex-basis: 25%;
  overflow: hidden;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: lightblue;
  position: relative;
  ${({ url }) => css`
    background-color: black;
    background-image: url(${url});
    background-size: 100%;
    background-position: center center;
    background-repeat: no-repeat;
  `}
  .icon {
    position: absolute;
    content: "";
    top: 5px;
    right: 5px;
    height: 20px;
    width: 20px;
    background-color: green;
    border-radius: 50%;
    color: white;
    cursor: pointer;
  }
`;

const EmptyCarrouselPic = styled.button`
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
