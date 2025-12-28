export async function POST(req: Request) {
  const { text } = await req.json();

  const res = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // send json as text to backend which till parse into a Python List
    body: JSON.stringify({ text }),
  }).catch((err) => {
    console.log(`Error on ML backend: ${err}`);
  });

  // translate back into json
  const data = await res.json();
  return Response.json(data);
}
