import React from "react";

import { render, cleanup, waitForElement, fireEvent, act, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, getByTestId, queryByText, queryByAltText} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
    it("defaults to Monday and changes the schedule when a new day is selected", async() => {
        const { getByText } = render(<Application />);

        await waitForElement(() => getByText("Monday"));

        fireEvent.click(getByText("Tuesday"));

        expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });

    it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
        const { container } = render(<Application />);

        await waitForElement(() => getByText(container, "Archie Cohen"));

        const appointments = getAllByTestId(container, "appointment");
        const appointment = appointments[0];

        fireEvent.click(getByAltText(appointment, "Add"));

        fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
            target: { value: "Lydia Miller-Jones" }
        });

        fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

        fireEvent.click(getByText(appointment, "Save"));

        expect(getByText(appointment, "Saving"))
            .toBeInTheDocument();

        // Since we're using WebSocket connection to update interview, than this test will not pass.

        await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

        const day = getAllByTestId(container, "day").find(day =>
            queryByText(day, "Monday")
        );

        expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    });

    it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() => {
        const { container } = render(<Application />);

        await waitForElement(() => getByText(container, "Archie Cohen"));

        const appointment = getAllByTestId(container, "appointment").find(
            appointment => queryByText(appointment, "Archie Cohen")
        );

        fireEvent.click(queryByAltText(appointment, "Delete"));

        expect(
            getByText(appointment, "Are you sure you would like to delete?")
        ).toBeInTheDocument();

        fireEvent.click(queryByText(appointment, "Confirm"));

        expect(getByText(appointment, "Deleting")).toBeInTheDocument();

        // Since we're using WebSocket connection to update interview, than the test below will not pass.

        await waitForElement(() => getByAltText(appointment, "Add"));

        const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday") );

        expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    });

    it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
        const { container } = render(<Application />);

        await waitForElement(() => getByText(container, "Archie Cohen"));

        const appointment = getAllByTestId(container, "appointment").find(
            appointment => queryByText(appointment, "Archie Cohen")
        );

        fireEvent.click(getByAltText(appointment, "Edit"));

        fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
            target: { value: "Eric Ho" }
        });

        fireEvent.click(getByText(appointment, "Save"));

        expect(getByText(appointment, "Saving")).toBeInTheDocument();

        // Since we're using WebSocket connection to update interview, than the test below will not pass.

        await waitForElement(() => getByText(appointment, "Eric Ho"));

        const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

        expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    });

    it("shows the save error when failing to save an appointment", async() => {
        const { container } = render(<Application />);

        await waitForElement(() => getByText(container, "Archie Cohen"));

        const appointments = getAllByTestId(container, "appointment");
        const appointment = appointments[0];

        fireEvent.click(getByAltText(appointment, "Add"));

        fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
            target: { value: "Lydia Miller-Jones"}
        });

        fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

        axios.put.mockRejectedValueOnce();

        fireEvent.click(getByText(appointment, "Save"));

        expect(getByText(appointment, "Saving")).toBeInTheDocument();

        await waitForElement(() => getByText(appointment, "Oops ... cannot save"));

        fireEvent.click(getByAltText(appointment, "Close"));

        expect(getByPlaceholderText(appointment, /enter student name/i));
    });

    it("shows the delete error when failing to delete an existing appointment", async() => {
        const { container } = render(<Application />);

        await waitForElement(() => getByText(container, "Archie Cohen"));

        const appointment = getAllByTestId(container, "appointment").find(
            appointment => queryByText(appointment, "Archie Cohen")
        );

        fireEvent.click(queryByAltText(appointment, "Delete"));

        expect(
            getByText(appointment, "Are you sure you want to delete?")
        ).toBeInTheDocument();

        axios.delete.mockRejectedValueOnce();

        fireEvent.click(getByText(appointment, "Confirm"));

        expect(getByText(appointment, "Deleting")).toBeInTheDocument();

        await waitForElement(() => getByText(appointment, "Oops ... cannot delete"));

        fireEvent.click(getByAltText(appointment, "Close"));

        expect(getByText(appointment, "Archie Cohen"));
    });
});
