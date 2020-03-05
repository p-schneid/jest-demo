import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import CheckboxWithLabel from "./checkbox-with-label";

it("CheckboxWithLabel changes the text after click", () => {
  const { container } = render(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />
  );

  const label = container.querySelector("label");
  const checkbox = container.querySelector("input");

  expect(label).toHaveTextContent("Off");

  fireEvent.click(checkbox);

  expect(label).toHaveTextContent("On");
});
