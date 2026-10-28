/**
 * PrepPilot Authentication, Multi-tenant Profiles, and Super Admin RBAC Service
 */

export type UserRole = 'super_admin' | 'student';
export type AccountStatus = 'approved' | 'pending' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely
  role: UserRole;
  status: AccountStatus;
  targetGateScore: number;
  college?: string;
  branch?: string;
  targetExamDate?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export const SUPER_ADMIN_CREDENTIALS = {
  id: 'super-admin-rishabh',
  name: (import.meta.env.VITE_SUPER_ADMIN_NAME || 'PrepPilot Administrator').trim(),
  email: (import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@preppilot.local').trim(),
  password: (import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'admin123').trim(),
  role: 'super_admin' as UserRole,
  status: 'approved' as AccountStatus,
  targetGateScore: 75,
  college: 'Computer Science & Engineering',
  branch: 'CSE',
  targetExamDate: '2027-02-06',
  bio: 'PrepPilot Super Admin • GATE CS 2027 Aspirant & Systems Engineering Lead',
  createdAt: '2026-10-27T06:00:00.000Z'
};

const USERS_STORAGE_KEY = 'preppilot_registered_users';
const CURRENT_USER_KEY = 'preppilot_active_user_session';

function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export const AuthService = {
  /**
   * Initializes users table and guarantees Rishabh Gautam exists as Super Admin.
   */
  init(): UserProfile {
    let users = getStoredUsers();

    // Check if super admin exists
    const adminIndex = users.findIndex(
      u => u.email.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
    );

    if (adminIndex === -1) {
      // Seed Super Admin Rishabh Gautam
      users = [SUPER_ADMIN_CREDENTIALS, ...users];
      saveStoredUsers(users);
    } else {
      // Ensure role is super_admin and status is approved
      users[adminIndex].role = 'super_admin';
      users[adminIndex].status = 'approved';
      if (!users[adminIndex].password) {
        users[adminIndex].password = SUPER_ADMIN_CREDENTIALS.password;
      }
      saveStoredUsers(users);
    }

    // Check if session exists
    const current = this.getCurrentUser();
    if (!current) {
      // Default initial session to Super Admin Rishabh Gautam
      const admin = users.find(
        u => u.email.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
      ) || SUPER_ADMIN_CREDENTIALS;
      this.setCurrentUser(admin);
      return admin;
    }

    // Refresh current user data from users list
    const refreshed = users.find(u => u.id === current.id);
    if (refreshed) {
      this.setCurrentUser(refreshed);
      return refreshed;
    }

    return current;
  },

  getAllUsers(): UserProfile[] {
    return getStoredUsers();
  },

  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile | null) {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  isSuperAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    return (
      user.role === 'super_admin' &&
      user.email.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
    );
  },

  login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'User not found. Please check your email or register.' };
    }

    if (found.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    found.lastLoginAt = new Date().toISOString();
    saveStoredUsers(users);
    this.setCurrentUser(found);

    return { success: true, user: found };
  },

  register(data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    branch?: string;
    targetGateScore?: number;
    bio?: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail || !data.password || !data.name) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const isSuperAdminEmail = cleanEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase();

    const newUser: UserProfile = {
      id: isSuperAdminEmail ? SUPER_ADMIN_CREDENTIALS.id : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      role: isSuperAdminEmail ? 'super_admin' : 'student',
      // New users MUST be approved by Super Admin Rishabh Gautam
      status: isSuperAdminEmail ? 'approved' : 'pending',
      targetGateScore: data.targetGateScore || 70,
      college: data.college?.trim() || 'Engineering College',
      branch: data.branch?.trim() || 'Computer Science',
      targetExamDate: '2027-02-06',
      bio: data.bio?.trim() || 'Aspirant for GATE CS 2027 & Campus Placements',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  logout() {
    this.setCurrentUser(null);
  },

  /**
   * Super Admin operation: Approve user access
   */
  approveUser(userId: string, adminUser: UserProfile): boolean {
    if (!this.isSuperAdmin(adminUser)) {
      console.error('Unauthorized: Only Super Admin Rishabh Gautam can approve accounts.');
      return false;
    }

    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    target.status = 'approved';
    target.approvedBy = adminUser.email;
    target.approvedAt = new Date().toISOString();
    delete target.rejectionReason;

    saveStoredUsers(users);

    // If currently logged in as this user, update session
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(target);
    }

    return true;
  },

  /**
   * Super Admin operation: Reject / Revoke user access
   */
  rejectUser(userId: string, adminUser: UserProfile, reason?: string): boolean {
    if (!this.isSuperAdmin(adminUser)) return false;

    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    // Never revoke Super Admin itself
    if (target.id === SUPER_ADMIN_CREDENTIALS.id || target.email.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return false;
    }

    target.status = 'rejected';
    target.rejectionReason = reason || 'Access not approved by Super Admin.';

    saveStoredUsers(users);

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(target);
    }

    return true;
  },

  /**
   * Super Admin operation: Delete user profile
   */
  deleteUser(userId: string, adminUser: UserProfile): boolean {
    if (!this.isSuperAdmin(adminUser)) return false;
    if (userId === SUPER_ADMIN_CREDENTIALS.id) return false;

    const users = getStoredUsers().filter(u => u.id !== userId);
    saveStoredUsers(users);
    return true;
  },

  /**
   * Update Profile details
   */
  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    // Preserve critical fields
    const updated = {
      ...users[index],
      ...updates,
      id: users[index].id,
      email: users[index].email, // Email stays fixed
      role: users[index].role,   // Role stays fixed
      status: users[index].status // Status stays fixed
    };

    users[index] = updated;
    saveStoredUsers(users);

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(updated);
    }

    return updated;
  }
};
