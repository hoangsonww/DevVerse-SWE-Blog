jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts={}) => ({ status: opts.status||200, body })
  }
}));

describe('POST /api/verify-user', () => {
  let POST, listUsers;

  beforeAll(() => {
    listUsers = jest.fn();
    require('@supabase/supabase-js').createClient.mockReturnValue({
      auth: { admin:{ listUsers } }
    });
    POST = require('../app/api/verify-email/route').POST;
  });

  test('400 if missing email', async () => {
    const res = await POST({ json: async()=>({}) });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error:'Email is required' });
  });

  test('500 if listUsers errors', async () => {
    listUsers.mockResolvedValue({ data:null, error:new Error('oops') });
    const res = await POST({ json: async()=>({ email:'e@f.com' }) });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error:'oops' });
  });

  test('exists=false', async () => {
    listUsers.mockResolvedValue({ data:{ users:[] }, error:null });
    const res = await POST({ json: async()=>({ email:'no@one.com' }) });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists:false });
  });

  test('exists=true', async () => {
    listUsers.mockResolvedValue({ data:{ users:[{ email:'hey@you.com' }] }, error:null });
    const res = await POST({ json: async()=>({ email:'hey@you.com' }) });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists:true });
  });
});
