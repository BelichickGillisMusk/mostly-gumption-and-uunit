import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FooterAdminAccess } from "./FooterAdminAccess";

describe("FooterAdminAccess", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gates admin access behind the 1225 password", async () => {
    const user = userEvent.setup();
    const onAccessGranted = vi.fn();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true });

    vi.stubGlobal("fetch", fetchMock);

    render(<FooterAdminAccess onAccessGranted={onAccessGranted} />);

    await user.click(screen.getByRole("button", { name: /admin \/ owner/i }));

    expect(
      screen.getByRole("dialog", { name: /owner access/i }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/password/i), "9999");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/admin-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ password: "9999" }),
    });
    expect(onAccessGranted).not.toHaveBeenCalled();
    expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "1225");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/admin-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ password: "1225" }),
    });

    expect(onAccessGranted).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /owner access/i }),
      ).not.toBeInTheDocument();
    });
  });
});
