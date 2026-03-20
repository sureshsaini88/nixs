export async function POST(request) {
  try {
    // Clear the userToken cookie
    const cookie = 'userToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    return Response.json({ 
      message: 'Logout successful'
    }, {
      headers: {
        'Set-Cookie': cookie
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
