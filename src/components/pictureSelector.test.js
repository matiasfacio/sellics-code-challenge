import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import App from "../App";

const renderComponent = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

test("1 - renders app", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/Approved Images/i)).toBeInTheDocument();
});

// when the user uses the app for the first time and there is no stored image
test("2 - at the beginning the amount of approved images is zero", () => {
  const { getByText } = renderComponent();
  expect(getByText("Approved Images (0)")).toBeDefined();
});

/* when testing and running out of requests */
/*
test("3 - display error message when fetching returns error", async () => {
  const { getByTestId, getByText } = renderComponent();
  fireEvent.click(getByTestId("load"));
  await waitFor(() =>
    expect(getByText(/Error Fetching Data/i)).toBeInTheDocument()
  );
});
*/

test("4 - update redux store after selecting a picture", async () => {
  console.log(
    "4 - we aware that this test works only in the case you can not fetch images, either because of exceeding quota, or no internet connection"
  );
  const { getByTestId, getByText } = renderComponent();
  fireEvent.click(getByTestId("load"));
  await waitFor(() => fireEvent.click(getByTestId("select")));
  await waitFor(() => expect(getByText("Approved Images (1)")).toBeDefined());
  await waitFor(() => expect(store.getState().selectedPictures.length).toBe(1));
});
