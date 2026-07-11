function createResult(finish) {
  finish("Database ready");
}

const promise = new Promise(createResult);

async function main() {
  const result = await promise;
  console.log(result);
}

main();