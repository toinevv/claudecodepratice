import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../SignInForm";
import { useAuth } from "@/hooks/use-auth";

// Mock the useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe("SignInForm", () => {
  const mockSignIn = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      signIn: mockSignIn,
      signUp: vi.fn(),
      isLoading: false,
    });
  });

  it("renders the sign in form with all fields", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("requires email and password fields", () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
  });

  it("updates input values when typing", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls signIn with correct credentials on form submission", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ success: true });

    render(<SignInForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("displays error message when sign in fails", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ 
      success: false, 
      error: "Invalid credentials" 
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("displays generic error message when no specific error is provided", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ success: false });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to sign in")).toBeInTheDocument();
    });
  });

  it("disables form inputs and shows loading state during submission", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue({
      signIn: mockSignIn,
      signUp: vi.fn(),
      isLoading: true,
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Signing in..." });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Signing in...");
  });

  it("clears error message when resubmitting form", async () => {
    const user = userEvent.setup();
    mockSignIn
      .mockResolvedValueOnce({ success: false, error: "Invalid credentials" })
      .mockResolvedValueOnce({ success: true });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    // First submission - should show error
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Second submission - error should be cleared
    await user.clear(passwordInput);
    await user.type(passwordInput, "correctpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });

  it("prevents form submission with empty fields through HTML validation", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    
    // HTML5 validation should prevent submission with empty required fields
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
  });

  it("validates email format", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText("Email");
    
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("masks password input", () => {
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText("Password");
    
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("does not call onSuccess callback when sign in fails", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ success: false, error: "Invalid credentials" });

    render(<SignInForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});