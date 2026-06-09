
async function runTest() {
  console.log("Starting retrieval test...");
  
  // 1. Get CSRF Token
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const initialCookies = csrfRes.headers.get('set-cookie');
  
  // 2. Authenticate
  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": initialCookies || ''
    },
    body: new URLSearchParams({
      email: 'prajit@mentora.edu',
      password: 'password',
      csrfToken: csrfToken,
      json: 'true'
    }),
    redirect: 'manual'
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  if (!setCookieHeader) {
    console.error("Login failed!");
    return;
  }
  
  const sessionCookie = setCookieHeader.split(',').find(c => c.includes('authjs.session-token'));
  const cookies = (initialCookies ? initialCookies.split(',').map(c => c.split(';')[0]).join('; ') + '; ' : '') + 
                 setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

  console.log("Session authenticated.");

  // 3. Test Retrieval
  const query = "What is a dummy PDF file?";
  console.log(`Searching for: "${query}"`);
  
  const retrievalRes = await fetch("http://localhost:3000/api/retrieval", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookies
    },
    body: JSON.stringify({ query })
  });

  const status = retrievalRes.status;
  const result = await retrievalRes.json();
  
  console.log(`\nRetrieval Status: ${status}`);
  console.dir(result, { depth: null, colors: true });
}

runTest();
