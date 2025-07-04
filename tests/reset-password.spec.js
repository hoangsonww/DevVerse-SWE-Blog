jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts = {}) => ({ status: opts.status || 200, body })
  }
}));
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('POST /api/reset-password', () => {
  let POST, listUsers, updateUserById;

  beforeAll(() => {
    listUsers = jest.fn();
    updateUserById = jest.fn();
    require('@supabase/supabase-js').createClient.mockReturnValue({
      auth: { admin: { listUsers, updateUserById } }
    });
    POST = require('../app/api/reset-password/route').POST;
  });

  test('400 if missing email or newPassword', async () => {
    const res = await POST({ json: async () => ({ email:'a@b.com' }) });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error:'Email and newPassword are required' });
  });

  test('500 if listUsers errors', async () => {
    listUsers.mockResolvedValue({ data:null, error:new Error('boom') });
    const res = await POST({ json: async() => ({ email:'x@y.com', newPassword:'p' }) });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error:'boom' });
  });

  test('404 if user not found', async () => {
    listUsers.mockResolvedValue({ data:{ users:[] }, error:null });
    const res = await POST({ json: async() => ({ email:'x@y.com', newPassword:'p' }) });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error:'User not found' });
  });

  test('500 if updateUserById errors', async () => {
    listUsers.mockResolvedValue({ data:{ users:[{ id:'u1', email:'x@y.com' }] }, error:null });
    updateUserById.mockResolvedValue({ error:new Error('upderr') });
    const res = await POST({ json: async() => ({ email:'x@y.com', newPassword:'p' }) });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error:'upderr' });
  });

  test('200 on success', async () => {
    listUsers.mockResolvedValue({ data:{ users:[{ id:'u1', email:'a@b.com' }] }, error:null });
    updateUserById.mockResolvedValue({ error:null });
    const res = await POST({ json: async() => ({ email:'a@b.com', newPassword:'new' }) });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message:'Password updated successfully' });
  });
});
