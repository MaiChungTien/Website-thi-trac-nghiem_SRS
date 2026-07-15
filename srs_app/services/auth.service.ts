// src/services/auth.service.ts

export const authService = {
  async login(data: any) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    // Cực kỳ quan trọng: Lưu thông tin auth vào Client (Cookie hoặc LocalStorage)
    // Ở Next.js, cách tốt nhất cho mock là set document.cookie
    document.cookie = `auth_token=${result.token}; path=/; max-age=86400`; // 1 ngày
    document.cookie = `user_role=${result.user.role}; path=/; max-age=86400`;

    return result;
  },

  async register(data: any) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    return result;
  },

  logout() {
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    window.location.href = '/auth/login';
  }
};