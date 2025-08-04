import { describe, it, expect, vi, beforeEach } from "vitest";
import { signIn, signUp, signOut, getUser } from "../index";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("signIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when email is missing", async () => {
    const result = await signIn("", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("should return error when password is missing", async () => {
    const result = await signIn("test@example.com", "");
    
    expect(result).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("should return error when user is not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    
    const result = await signIn("test@example.com", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "Invalid credentials",
    });
  });

  it("should return error when password is incorrect", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false);
    
    const result = await signIn("test@example.com", "wrong-password");
    
    expect(result).toEqual({
      success: false,
      error: "Invalid credentials",
    });
  });

  it("should sign in successfully with correct credentials", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true);
    vi.mocked(createSession).mockResolvedValue(undefined);
    
    const result = await signIn("test@example.com", "correct-password");
    
    expect(result).toEqual({ success: true });
    expect(createSession).toHaveBeenCalledWith("user-123", "test@example.com");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("Database error"));
    
    const result = await signIn("test@example.com", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "An error occurred during sign in",
    });
  });
});

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when email is missing", async () => {
    const result = await signUp("", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("should return error when password is missing", async () => {
    const result = await signUp("test@example.com", "");
    
    expect(result).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("should return error when password is too short", async () => {
    const result = await signUp("test@example.com", "short");
    
    expect(result).toEqual({
      success: false,
      error: "Password must be at least 8 characters",
    });
  });

  it("should return error when email already exists", async () => {
    const existingUser = {
      id: "existing-user",
      email: "test@example.com",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);
    
    const result = await signUp("test@example.com", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "Email already registered",
    });
  });

  it("should create user successfully with valid data", async () => {
    const newUser = {
      id: "new-user-123",
      email: "newuser@example.com",
      password: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password");
    vi.mocked(prisma.user.create).mockResolvedValue(newUser);
    vi.mocked(createSession).mockResolvedValue(undefined);
    
    const result = await signUp("newuser@example.com", "password123");
    
    expect(result).toEqual({ success: true });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "newuser@example.com",
        password: "hashed-password",
      },
    });
    expect(createSession).toHaveBeenCalledWith("new-user-123", "newuser@example.com");
  });

  it("should handle database errors during user creation", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password");
    vi.mocked(prisma.user.create).mockRejectedValue(new Error("Database error"));
    
    const result = await signUp("newuser@example.com", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "An error occurred during sign up",
    });
  });

  it("should handle bcrypt errors", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockRejectedValue(new Error("Hash error"));
    
    const result = await signUp("newuser@example.com", "password123");
    
    expect(result).toEqual({
      success: false,
      error: "An error occurred during sign up",
    });
  });
});

describe("signOut", () => {
  it("should delete session and redirect", async () => {
    const { redirect } = await import("next/navigation");
    
    await signOut();
    
    expect(deleteSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("getUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when no session exists", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    
    const user = await getUser();
    
    expect(user).toBeNull();
  });

  it("should return user data when session exists", async () => {
    const mockSession = { userId: "user-123", email: "test@example.com" };
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      createdAt: new Date(),
    };
    
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    
    const user = await getUser();
    
    expect(user).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-123" },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  });

  it("should return null on database error", async () => {
    const mockSession = { userId: "user-123", email: "test@example.com" };
    
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("Database error"));
    
    const user = await getUser();
    
    expect(user).toBeNull();
  });
});